// cloud/src/bookOrder.js — POST /book-order (zamówienie książki, transfer + tpay)
// Rezerwacja stanu magazynowego: sprawdzenie + odjęcie PRZED utworzeniem transakcji.
const supabase = require("./supabase");
const { sendMail } = require("./mailer");
const emails = require("./email/templates");
const { notify } = require("./notify");
const { rateLimit } = require("./validate");
const { getPaymentFee } = require("./fees");
const { createTransaction } = require("./tpay");

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

  const method = d.paymentMethod === "tpay" ? "tpay" : "transfer";
  const base = Math.round(Number(d.costs?.total ??
    d.items.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.qty) || 1), 0)) * 100) / 100;
  const fee = getPaymentFee(base, method);
  const amount = Math.round((base + fee) * 100) / 100;

  const orderNumber = d.orderNumber ||
    `CEEA-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  // ── 📦 REZERWACJA STANU MAGAZYNOWEGO (przed tpay!) ──
  for (const item of d.items) {
    if (!item.productId) continue; // produkt niepowiązany z products – pomijamy kontrolę
    const qty = Number(item.qty) || 1;

    const { data: p } = await supabase
      .from("products")
      .select("id, stock_quantity")
      .eq("datocms_id", String(item.productId))
      .maybeSingle();

    if (!p) continue;

    if (p.stock_quantity < qty) {
      return res.status(409).json({
        error: `Niewystarczająca liczba egzemplarzy: „${item.title}” (dostępne: ${p.stock_quantity}).`,
      });
    }

    const { error: stockErr } = await supabase
      .from("products")
      .update({ stock_quantity: p.stock_quantity - qty })
      .eq("id", p.id);

    if (stockErr) {
      console.error("stock update:", stockErr.message);
      return res.status(500).json({ error: "Błąd rezerwacji stanu. Spróbuj ponownie." });
    }
  }

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
    items: d.items,
    amount,
    status: method === "tpay" ? "awaiting_payment" : "awaiting_transfer",
    payload: d,
  };

  if (method === "tpay") {
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
  }

  const { data: order, error } = await supabase.from("book_orders").insert(row).select().single();
  if (error) throw error;

  const tpl = method === "tpay" ? "bookOrderConfirmationOnline" : "bookOrderConfirmationTransfer";
  sendMail({ ...emails[tpl]({ ...d, amount, fee, orderNumber, resumeUrl: transactionUrl }), to: d.email })
    .catch(e => console.error("mail:", e.message));
  sendMail({ ...emails.bookOrderOrganizer({ ...d, amount, fee, orderNumber }), to: process.env.ORGANIZER_EMAIL || "sekretariat@ceea.org.pl" })
    .catch(e => console.error("mail:", e.message));

  notify({
    type: "book",
    title: `📚 Zamówienie książki: ${d.firstName || d.name} ${d.lastName || d.surname}`,
    body: `${d.items.map(i => i.title).join(", ")} – ${amount} zł${fee ? ` (w tym opłata ${fee} zł)` : ""}`,
    link: "/ceea-poznan-admin/",
  }).catch(e => console.error("notify:", e.message));

  return res.json({ ok: true, orderId: order.id, orderNumber, transactionUrl });
}

module.exports = { bookOrderHandler };