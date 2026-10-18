// cloud/src/register.js – POST /register
// Zapis do Supabase + emaile + (Online) transakcja tpay
const supabase = require("./supabase");
const { getPaymentFee } = require("./fees");
const { sendMail } = require("./mailer");
const emails = require("./emails");
const { createTransaction } = require("./tpay");

const MAX_SEATS = Number(process.env.MAX_SEATS_PER_COURSE || 100);
const ACTIVE = ["awaiting_transfer", "awaiting_payment", "paid"];

async function registerHandler(req, res) {
  const d = req.body || {};

  // Walidacja minimum
  if (!d.orderNumber || !d.email || !d.courseId || !d.baseAmount) {
    return res.status(400).json({ error: "Brak wymaganych pól" });
  }

  const method = d.paymentMethod === "tpay" ? "tpay" : "transfer";
  const paymentFee = getPaymentFee(d.baseAmount, method); // liczymy SAMI
  const amount = Math.round((Number(d.baseAmount) + paymentFee) * 100) / 100;

  // Limit miejsc (idempotentny zapis tego samego orderNumber zawsze przechodzi)
  const { count } = await supabase
    .from("payments").select("id", { count: "exact", head: true })
    .eq("course_id", String(d.courseId)).in("status", ACTIVE);

  const { data: existing } = await supabase
    .from("payments").select("*").eq("order_number", d.orderNumber).maybeSingle();

  if (!existing && (count ?? 0) >= MAX_SEATS) {
    return res.status(409).json({ error: "Brak wolnych miejsc na tym kursie." });
  }
  if (existing) {
    // Ponowne wysłanie – zwracamy poprzedni stan (np. transactionUrl do opłacenia)
    return res.json({ ok: true, orderNumber: d.orderNumber, alreadyExists: true,
      transactionUrl: existing.status === "awaiting_payment" ? existing.resume_url : undefined });
  }

  // Użytkownik + płatność
  const { data: user, error: userError } = await supabase
    .from("users")
    .upsert({ email: d.email, name: d.firstName || null, surname: d.surName || null,
      phone: d.phone ? String(d.phone) : null }, { onConflict: "email" })
    .select().single();
  if (userError) throw userError;

  const paymentRow = {
    order_number: d.orderNumber,
    user_id: user.id,
    course_id: String(d.courseId),
    amount,
    currency: "PLN",
    method,
    status: method === "tpay" ? "awaiting_payment" : "awaiting_transfer",
    payload: d.payload || d,
    notes: JSON.stringify({ paymentFee, baseAmount: Number(d.baseAmount) }),
  };

  // tpay: utwórz transakcję PRZED zapisem (żeby mieć external_id)
  let transactionUrl;
  if (method === "tpay") {
    const tx = await createTransaction({
      amount,
      description: `Kurs: ${d.courseTitle || d.courseId} – ${d.orderNumber}`,
      payer: { email: d.email, name: `${d.firstName || ""} ${d.surName || ""}`.trim(),
        phone: d.phone ? String(d.phone) : undefined },
      orderNumber: d.orderNumber,
    });
    paymentRow.external_id = String(tx.transactionId);
    paymentRow.resume_url = tx.transactionUrl; // kursant może dokończyć płatność
    transactionUrl = tx.transactionUrl;
  }

  const { error: payError } = await supabase
    .from("payments").insert(paymentRow).select().single();
  if (payError) throw payError;

  // Emaile (fire & forget – nie blokują odpowiedzi)
  const p = { ...d, amount, paymentFee };
  if (method === "transfer") {
    // Jeden mail: potwierdzenie + dane do przelewu (Twój szablon)
    sendMail({ ...emails.courseConfirmationTransfer(p, d.orderNumber), to: d.email })
      .catch(e => console.error("mail:", e.message));
  }
  // Online: mail potwierdzający pochodzi z webhooka (paymentSuccess)
  // (sendMail sam wysyła kopię do sekretariatu – bez dodatkowego wywołania)

  return res.json({ ok: true, orderNumber: d.orderNumber, transactionUrl });
}

module.exports = { registerHandler };
