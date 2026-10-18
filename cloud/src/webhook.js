// cloud/src/webhook.js – POST /tpay-webhook (+ logika współdzielona z /simulate)
// Obsługuje: płatności kursowe (payments) ORAZ zamówienia książek (book_orders)
const supabase = require("./supabase");
const { verifyWebhook, MODE } = require("./tpay");
const { sendMail } = require("./mailer");
const emails = require("./email/templates");
const { notify } = require("./notify");

const RANK = { canceled: 0, awaiting_transfer: 1, awaiting_payment: 1, paid: 2 };

// Jedyna funkcja zmieniająca status. Wywoływana przez: webhook tpay, /simulate, /mark-paid.
async function applyPaymentStatus(orderNumber, tpayStatus) {
  const newStatus = tpayStatus === "success" ? "paid"
    : ["canceled", "refunded", "rejected"].includes(tpayStatus) ? "canceled"
    : null;
  if (!newStatus) return { ok: true, changed: false };

  // ── 1. Płatności kursowe (payments) ──
  const { data: payment } = await supabase
    .from("payments").select("*").eq("order_number", orderNumber).maybeSingle();

  if (payment) {
    if (RANK[newStatus] > RANK[payment.status]) {
      const { data: updated } = await supabase
        .from("payments")
        .update({
          status: newStatus,
          paid_at: newStatus === "paid" ? new Date().toISOString() : null,
        })
        .eq("id", payment.id)
        .select();

      if (updated?.length && newStatus === "paid") {
        const p = { ...(payment.payload || {}), amount: payment.amount };
        sendMail({ ...emails.paymentSuccess(p, orderNumber), to: p.email })
          .catch(e => console.error("mail:", e.message));
        console.log(`✅ PAID (kurs) ${orderNumber}`);
      }
    }
    return { ok: true, changed: false }; // znalezione w payments – koniec
  }

  // ── 2. Zamówienia książek (book_orders) ──
  const { data: bookOrder } = await supabase
    .from("book_orders").select("*").eq("order_number", orderNumber).maybeSingle();

  if (!bookOrder) return { error: "not_found" };

  const bookRank = { awaiting_payment: 1, awaiting_transfer: 1, paid: 2, sent: 2, canceled: 0 };
  if (bookRank[newStatus] > bookRank[bookOrder.status]) {
    const { data: updated } = await supabase
      .from("book_orders")
      .update({ status: newStatus })
      .eq("id", bookOrder.id)
      .select();

    // 📦 Przywróć stan magazynowy przy anulowaniu (rezerwacja była odjęta w /book-order)
    if (updated?.length && newStatus === "canceled") {
      for (const item of bookOrder.items || []) {
        if (!item.productId) continue;
        const qty = Number(item.qty) || 1;
        const { data: p } = await supabase
          .from("products")
          .select("id, stock_quantity")
          .eq("datocms_id", String(item.productId))
          .maybeSingle();
        if (p) {
          await supabase
            .from("products")
            .update({ stock_quantity: p.stock_quantity + qty })
            .eq("id", p.id);
        }
      }
      console.log(`↩️ STOCK RESTORED ${orderNumber}`);
    }

    if (updated?.length && newStatus === "paid") {
      console.log(`✅ PAID (książki) ${orderNumber}`);
      notify({
        type: "book",
        title: `Książki opłacone: ${bookOrder.email}`,
        body: `${orderNumber} – ${bookOrder.amount} zł`,
        link: "/ceea-poznan-admin/",
      }).catch(e => console.error("notify:", e.message));
    }
  }
  return { ok: true, changed: false };
}

async function webhookHandler(req, res) {
  // Tryb testowy: zamiast JWS wymagany klucz admina (symulator strona /simulate)
  if (MODE === "test" && req.headers["x-test-key"] !== process.env.ADMIN_KEY) {
    return res.status(401).json({ result: "FAIL" });
  }

  const payload = await verifyWebhook(req.rawBody, req.headers["x-jws-signature"]);
  if (!payload) return res.status(401).json({ result: "FAIL" });

  const orderNumber = payload.orderId;
  const tpayStatus = payload.status;
  if (!orderNumber) return res.status(400).json({ result: "FAIL" });

  const result = await applyPaymentStatus(orderNumber, tpayStatus);
  if (result.error === "not_found") return res.status(404).json({ result: "FAIL" });

  return res.json({ result: "OK" }); // 200 = tpay kończy retry
}

module.exports = { webhookHandler, applyPaymentStatus };