// cloud/src/bookOrder.js — POST /book-order (zamówienie książki, transfer + tpay)
// Rezerwacja stanu magazynowego: atomowa (RPC), z rollbackiem przy błędzie.
const supabase = require("./supabase");
const { sendMail } = require("./mailer");
const emails = require("./email/templates");
const { notify } = require("./notify");
const { rateLimit } = require("./validate");
const { getPaymentFee } = require("./fees");
const { createTransaction } = require("./tpay");

async function restoreStock(decremented) {
  for (const s of decremented) {
    await supabase.rpc("increment_stock", {
      p_datocms_id: String(s.productId),
      p_qty: s.qty,
    });
  }
}

async function bookOrderHandler(req, res) {
  if (!rateLimit(req.headers["x-forwarded-for"]?.split(",")[0] || req.socket?.remoteAddress, 5)) {
    return res.status(429).json({ error: "Za dużo prób. Odczekaj chwilę." });
  }

  const d = req.body || {};
  if (!d.email || !d.items?.length) return res.status(400).json({ error: "Brak wymaganych pól" });

  // Token antyspamowy (generowany w przeglądarce; bot bez JS go nie ma)
  if (!d.token || String(d.token).length < 10) {
    return res.status(400).json({ error: "Invalid token" });
  }

  // ── Normalizacja pozycji ──
  // Store na frontendzie trzyma `quantity`; starsze wersje koszyka mogły nie mieć productId.
  const items = d.items.map(i => ({
    ...i,
    productId: i.productId ?? i.datocmsId ?? i.id ?? null,
    qty: Number(i.qty ?? i.quantity) || 1,
  }));

  const method = d.paymentMethod === "tpay" ? "tpay" : "transfer";
  const base = Math.round(Number(d.costs?.total ??
    items.reduce((s, i) => s + (Number(i.price) || 0) * i.qty, 0)) * 100) / 100;
  const fee = getPaymentFee(base, method);
  const amount = Math.round((base + fee) * 100) / 100;

  const orderNumber = d.orderNumber ||
    `CEEA-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  // ── 📦 REZERWACJA STANU MAGAZYNOWEGO (atomowo, przed tpay) ──
  const decremented = [];   // do rollbacku
  const stockWarnings = []; // trafią do logów i maila do organizatora

  for (const item of items) {
    if (!item.productId) {
      stockWarnings.push(`pozycja bez productId: „${item.title || "?"}" ×${item.qty}`);
      console.error("⚠️ [book-order] POZYCJA BEZ productId:", JSON.stringify(item));
      continue;
    }

    const { data: newStock, error: rpcErr } = await supabase.rpc("decrement_stock", {
      p_datocms_id: String(item.productId),
      p_qty: item.qty,
    });

    if (rpcErr) {
      console.error("stock update:", rpcErr.message);
      await restoreStock(decremented);
      return res.status(500).json({ error: "Błąd rezerwacji stanu. Spróbuj ponownie." });
    }

    if (newStock === null) {
      // NULL = produkt nie istnieje albo za mało sztuk — rozróżniamy:
      const { data: p } = await supabase
        .from("products")
        .select("stock_quantity")
        .eq("datocms_id", String(item.productId))
        .maybeSingle();

      if (!p) {
        // Produkt niepowiązany z tabelą products — NIE blokujemy sprzedaży,
        // ale zostawiamy wyraźny ślad zamiast cichego pominięcia.
        stockWarnings.push(`brak w products (datocms_id=${item.productId}): „${item.title || "?"}" ×${item.qty}`);
        console.error("⚠️ [book-order] BRAK PRODUKTU w products dla datocms_id:", item.productId, JSON.stringify(item));
        continue;
      }

      await restoreStock(decremented);
      return res.status(409).json({
        error: `Niewystarczająca liczba egzemplarzy: „${item.title}” (dostępne: ${p.stock_quantity}).`,
      });
    }

    decremented.push({ productId: item.productId, qty: item.qty });
    console.log(`📦 STOCK ${item.productId}: -${item.qty} → ${newStock}`);
  }

  // ── Transakcja tpay (przed zapisem zamówienia, jak dotychczas) ──
  let transactionUrl;
  const row = {
    order_number: orderNumber,
    email: d.email.toLowerCase().trim(),
    name: d.firstName || d.name || null,
    surname: d.lastName || d.surname || null,
    phone: d.phone || null,
    delivery_method: d.delivery?.method === "courier" ? "courier" : "paczkomat",
    street: d.delivery?.address?.street || null,
    city: d.delivery?.address?.city || null,
    postcode: d.delivery?.address?.postcode || null,
    parcel_locker_code: d.delivery?.locker?.code || null,
    items, // ← znormalizowane (productId + qty), spójne z webhookiem
    amount,
    status: method === "tpay" ? "awaiting_payment" : "awaiting_transfer",
    payload: d,
  };

  if (method === "tpay") {
    try {
      const tx = await createTransaction({
        amount,
        description: `Książki CEEA – ${orderNumber}`,
        payer: {
          email: d.email,
          name: `${d.firstName || d.name || ""} ${d.lastName || d.surname || ""}`.trim(),
          phone: d.phone || undefined,
        },
        orderNumber,
      });
      row.external_id = String(tx.transactionId);
      row.resume_url = tx.transactionUrl;
      transactionUrl = tx.transactionUrl;
    } catch (e) {
      console.error("tpay createTransaction:", e.message);
      await restoreStock(decremented); // ← wcześniej stan przepadał bez śladu
      return res.status(502).json({ error: "Nie udało się utworzyć płatności. Spróbuj ponownie." });
    }
  }

  const { data: order, error } = await supabase.from("book_orders").insert(row).select().single();
  if (error) {
    console.error("order insert:", error.message);
    await restoreStock(decremented);
    return res.status(500).json({ error: "Błąd zapisu zamówienia. Spróbuj ponownie." });
  }

  const tpl = method === "tpay" ? "bookOrderConfirmationOnline" : "bookOrderConfirmationTransfer";
  sendMail({ ...emails[tpl]({ ...d, items, amount, fee, orderNumber, resumeUrl: transactionUrl }), to: d.email })
    .catch(e => console.error("mail:", e.message));
  sendMail({
    ...emails.bookOrderOrganizer({
      ...d, items, amount, fee, orderNumber,
      stockWarnings: stockWarnings.length ? stockWarnings : undefined, // ← ostrzeżenia w mailu do Ciebie
    }),
    to: process.env.ORGANIZER_EMAIL || "sekretariat@ceea.org.pl",
  }).catch(e => console.error("mail:", e.message));

  if (stockWarnings.length) {
    notify({
      type: "book",
      title: "⚠️ Zamówienie bez pełnej rezerwacji stanu",
      body: `${orderNumber}: ${stockWarnings.join("; ")}`,
      link: "/ceea-poznan-admin/",
    }).catch(e => console.error("notify:", e.message));
  }

  notify({
    type: "book",
    title: `📚 Zamówienie książki: ${d.firstName || d.name} ${d.lastName || d.surname}`,
    body: `${items.map(i => i.title).join(", ")} – ${amount} zł${fee ? ` (w tym opłata ${fee} zł)` : ""}`,
    link: "/ceea-poznan-admin/",
  }).catch(e => console.error("notify:", e.message));

  return res.json({ ok: true, orderId: order.id, orderNumber, transactionUrl });
}

module.exports = { bookOrderHandler };