// cloud/src/orderStatus.js – GET /order-status?orderNumber=...
const supabase = require("./supabase");

const STATUS_PL = {
  awaiting_transfer: "Oczekuje na przelew",
  awaiting_payment: "Oczekuje na płatność online",
  paid: "Opłacone",
  sent: "Wysłane",
  canceled: "Anulowane",
  expired: "Wygasło",
};

async function orderStatusHandler(req, res) {
  const orderNumber = req.query?.orderNumber;
  if (!orderNumber) return res.status(400).json({ error: "Brak orderNumber" });

  // 1. Kursy
  const { data: payment } = await supabase
    .from("payments")
    .select("order_number, amount, currency, method, status, paid_at, course_id")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (payment) {
    return res.json({
      orderNumber: payment.order_number,
      amount: payment.amount,
      currency: payment.currency,
      method: payment.method,
      status: payment.status,
      statusLabel: STATUS_PL[payment.status] || payment.status,
      paidAt: payment.paid_at,
      kind: "course",
    });
  }

  // 2. Książki
  const { data: book } = await supabase
    .from("book_orders")
    .select("order_number, amount, status, created_at")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (!book) return res.status(404).json({ error: "Nie znaleziono zamówienia" });

  return res.json({
    orderNumber: book.order_number,
    amount: book.amount,
    currency: "PLN",
    method: "tpay",
    status: book.status,
    statusLabel: STATUS_PL[book.status] || book.status,
    paidAt: book.status === "paid" ? book.created_at : null,
    kind: "book",
  });
}

module.exports = { orderStatusHandler };