// cloud/src/bookNotify.js — POST /book-notify (lista oczekujących na książkę)
const supabase = require("./supabase");
const { sendMail } = require("./mailer");
const emails = require("./email/templates");
const { rateLimit } = require("./validate");

async function bookNotifyHandler(req, res) {
  if (!rateLimit(req.headers["x-forwarded-for"]?.split(",")[0] || req.socket?.remoteAddress, 5)) {
    return res.status(429).json({ error: "Za dużo prób. Odczekaj chwilę." });
  }
  const { email, productId, title } = req.body || {};
  if (!email || !productId) return res.status(400).json({ error: "Brak wymaganych pól" });

  // produkt po datocms_id (products.datocms_id)
  const { data: product } = await supabase.from("products")
    .select("id").eq("datocms_id", String(productId)).maybeSingle();

  const { error } = await supabase.from("book_notifications").insert({
    product_id: product?.id || null,
    email: email.toLowerCase().trim(),
    status: "pending",
    // tytuł zapamiętujemy w mailu; jak produkt nie znany – notify i tak działa
  });
  if (error && error.code !== "23505") throw error; // duplikat = ignoruj

  sendMail({ ...emails.bookNotifyConfirmation({ title }), to: email })
    .catch(e => console.error("mail:", e.message));

  return res.json({ ok: true });
}

module.exports = { bookNotifyHandler };