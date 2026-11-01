// cloud/src/bookMarkPaid.js — POST /book-mark-paid
// Ręczne zaksięgowanie wpłaty za zamówienie książek, wywoływane z panelu admina.
// Analogicznie do /mark-paid (kursy): status -> "paid" + mail do klienta + kopia do sekretariatu.
//
// UWAGA — dopasuj do swoich modułów (nie znam ich eksportów):
//   1) ./supabase — zakładam, że eksportuje gotowego klienta (jak w innych handlerach)
//   2) ./mailer   — zakładam funkcję send({ to, subject, html, text });
//                   jeśli u Ciebie nazywa się inaczej (np. sendMail), popraw wywołanie niżej
//   3) sekret     — nagłówek x-admin-key vs env ADMIN_KEY (tak samo jak w /mark-paid;
//                   panel wysyła CEEA_ADMIN_KEY, który ma być równy ADMIN_KEY z Cloud Run)

const supabase = require("./supabase");
const mailer = require("./mailer");
const bookPayment = require("./email/templates/bookPayment");

const ORGANIZER_EMAIL =
  process.env.ORGANIZER_EMAIL || process.env.SECRETARIAT_EMAIL || ""; // kopia do sekretariatu

async function sendMail(msg) {
  // dopasuj jedną linijkę do swojego mailer.js:
  if (typeof mailer.send === "function") return mailer.send(msg);
  if (typeof mailer.sendMail === "function") return mailer.sendMail(msg);
  if (typeof mailer === "function") return mailer(msg);
  throw new Error("Nie rozpoznano interfejsu ./mailer — dopasuj sendMail() w bookMarkPaid.js");
}

exports.bookMarkPaidHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Ten sam sekret co w /mark-paid: panel wysyła x-admin-key = CEEA_ADMIN_KEY,
  // który odpowiada ADMIN_KEY ustawionemu w usłudze Cloud Run.
  if (process.env.ADMIN_KEY) {
    if (req.headers["x-admin-key"] !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  try {
    const { orderId, orderNumber } = req.body || {};
    if (!orderId && !orderNumber) {
      return res.status(400).json({ error: "Podaj orderId lub orderNumber" });
    }

    // 1) Pobierz zamówienie
    let q = supabase.from("book_orders").select("*");
    q = orderId ? q.eq("id", orderId) : q.eq("order_number", orderNumber);
    const { data: order, error } = await q.maybeSingle();
    if (error) throw error;
    if (!order) return res.status(404).json({ error: "Nie znaleziono zamówienia" });

    // 2) Idempotentnie: już opłacone -> bez ponownej wysyłki maila
    if (order.status === "paid") {
      return res.json({ ok: true, alreadyPaid: true, order_number: order.order_number });
    }

    // 3) Zaksięguj wpłatę
    const { error: updErr } = await supabase
      .from("book_orders")
      .update({ status: "paid" })
      .eq("id", order.id);
    if (updErr) throw updErr;

    // 4) Mail do klienta + kopia do sekretariatu
    const clientMsg = bookPayment.success(order);
    await sendMail({ to: order.email, ...clientMsg });

    if (ORGANIZER_EMAIL) {
      const orgMsg = bookPayment.organizerNotification(order);
      await sendMail({ to: ORGANIZER_EMAIL, ...orgMsg });
    }

    return res.json({ ok: true, alreadyPaid: false, order_number: order.order_number });
  } catch (err) {
    console.error("❌ book-mark-paid:", err.message);
    return res.status(500).json({ error: err.message });
  }
};