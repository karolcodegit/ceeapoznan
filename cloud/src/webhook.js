// cloud/src/webhook.js – POST /tpay-webhook (+ logika współdzielona z /simulate)
// Obsługuje: płatności kursowe (payments) ORAZ zamówienia książek (book_orders)
const supabase = require("./supabase");
const { verifyWebhook, MODE } = require("./tpay");
const { sendMail } = require("./mailer");
const emails = require("./email/templates");
const { notify } = require("./notify");
const { requireAdminKey } = require("./adminAuth");
const { expectedCourseAmount, expectedBookAmount, providerPaymentMatches } = require("./pricing");

const RANK = { canceled: 0, awaiting_transfer: 1, awaiting_payment: 1, paid: 2 };

// Jedyna funkcja zmieniająca status. Wywoływana przez: webhook tpay, /simulate, /mark-paid.
async function applyPaymentStatus(orderNumber, tpayStatus, verification = {}) {
  const status = String(tpayStatus || "").toLowerCase();
  const newStatus = ["success", "correct", "true"].includes(status) ? "paid"
    : ["canceled", "refunded", "rejected", "chargeback"].includes(status) ? "canceled"
    : null;
  if (!newStatus) return { ok: true, changed: false };

  // ── 1. Płatności kursowe (payments) ──
  const { data: payment } = await supabase
    .from("payments").select("*").eq("order_number", orderNumber).maybeSingle();

  if (payment) {
    if (newStatus === "paid") {
      if (verification.source === "tpay" && (payment.method !== "tpay" || !providerPaymentMatches(
        payment.order_number, payment.amount, verification.providerPayload, payment.external_id
      ))) return { error: "amount_mismatch" };

      const expected = expectedCourseAmount(payment);
      if (expected != null) {
        if (Math.round(Number(payment.amount) * 100) !== Math.round(expected * 100)) {
          return { error: "amount_mismatch" };
        }
      } else if (!["admin", "simulation"].includes(verification.source)) {
        return { error: "amount_mismatch" };
      }
    }
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
    return { ok: true, changed: false };
  }

  // ── 2. Zamówienia książek (book_orders) ──
  const { data: bookOrder } = await supabase
    .from("book_orders").select("*").eq("order_number", orderNumber).maybeSingle();

  if (!bookOrder) return { error: "not_found" };
  if (newStatus === "paid") {
    if (verification.source === "tpay" && (bookOrder.payload?.paymentMethod !== "tpay" || !providerPaymentMatches(
      bookOrder.order_number, bookOrder.amount, verification.providerPayload, bookOrder.external_id
    ))) return { error: "amount_mismatch" };

    const expected = expectedBookAmount(bookOrder);
    if (expected != null) {
      if (Math.round(Number(bookOrder.amount) * 100) !== Math.round(expected * 100)) {
        return { error: "amount_mismatch" };
      }
    } else if (!["admin", "simulation"].includes(verification.source)) {
      return { error: "amount_mismatch" };
    }
  }

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
        const productId = item.productId ?? item.datocmsId ?? item.id;
        if (!productId) continue;
        const qty = Number(item.qty ?? item.quantity) || 1;
        await supabase.rpc("increment_stock", {
          p_datocms_id: String(productId),
          p_qty: qty,
        });
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
  if (req.method !== "POST") return res.status(405).json({ result: "FAIL" });
  // Test mode accepts unsigned JSON only with an explicit non-production opt-in.
  if (MODE === "test") {
    if (
      process.env.NODE_ENV === "production" ||
      process.env.ALLOW_PAYMENT_SIMULATION !== "true"
    ) {
      return res.status(403).json({ result: "FAIL" });
    }
    if (!requireAdminKey(req, res, "x-test-key")) return;
  } else if (MODE !== "sandbox" && MODE !== "production") {
    // sandbox/production require detached JWS + X.509 verify below.
    // unknown/disabled modes fail closed.
    return res.status(503).json({ result: "FAIL" });
  }

  const payload = await verifyWebhook(req.rawBody, req.headers["x-jws-signature"]);
  if (!payload) return res.status(401).json({ result: "FAIL" });

  const event = payload.data || payload;
  const orderNumber = event.orderId || event.transactionHiddenDescription || event.tr_crc || event.crc;
  const tpayStatus = event.status || event.transactionStatus || event.tr_status;
  if (!orderNumber) return res.status(400).json({ result: "FAIL" });

  const result = await applyPaymentStatus(orderNumber, tpayStatus, {
    source: "tpay",
    providerPayload: payload,
  });
  if (result.error === "not_found") return res.status(404).json({ result: "FAIL" });
  if (result.error === "amount_mismatch") return res.status(400).json({ result: "FAIL" });

  return res.json({ result: "OK" }); // 200 = tpay kończy retry
}

module.exports = { webhookHandler, applyPaymentStatus };
