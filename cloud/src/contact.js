// cloud/src/contact.js — POST /contact (formularz kontaktowy z ceea.org.pl)
const { sendMail } = require("./mailer");
const emails = require("./email/templates");
const { notify } = require("./notify");
const { rateLimit } = require("./validate");



async function contactHandler(req, res) {

  const d = req.body || {};

  if (!rateLimit(req.headers["x-forwarded-for"]?.split(",")[0] || req.socket?.remoteAddress, 5)) {
    return res.status(429).json({ error: "Za dużo prób. Odczekaj chwilę." });
  }

  
  const { name, email, message } = req.body || {};

  if (!d.token || String(d.token).length < 10) {
    return res.status(400).json({ error: "Invalid token" });
  }
  if (!email || !message) return res.status(400).json({ error: "Brak wymaganych pól" });

  sendMail({ ...emails.contactConfirmation({ name, message }), to: email })
  .catch(e => console.error("mail:", e.message));

  sendMail({
    ...emails.contactOrganizer({ name, email, message }),
    to: process.env.ORGANIZER_EMAIL || "sekretariat@ceea.org.pl",
    replyTo: email,                       // ← „Odpowiedz" = odpowiedź kursantowi
  }).catch(e => console.error("mail:", e.message));

  notify({
    type: "contact",
    title: `✉️ Formularz kontaktowy: ${name || email}`,
    body: String(message).slice(0, 200),
    link: "/ceea-poznan-admin/",
  }).catch(e => console.error("notify:", e.message));

  return res.json({ ok: true });
}

module.exports = { contactHandler };