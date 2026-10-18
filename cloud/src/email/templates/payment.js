// cloud/src/email/templates/payment.js — zaksięgowanie wpłaty + kopia do sekretariatu
const { renderEmail, money, esc, ORG } = require("../layout");

const success = (p, orderNumber) => ({
  subject: `Potwierdzenie płatności – kurs "${p.courseTitle}" – CEEA Poznań`,
  html: renderEmail({
    preheader: `Potwierdziliśmy otrzymanie wpłaty za kurs "${p.courseTitle}".`,
    title: `Dzień dobry ${esc(p.firstName || "")},`.trim(),
    content: `
      <p>potwierdzamy zaksięgowanie wpłaty <strong>${money(p.amount)}</strong> za udział
         w kursie <strong>"${esc(p.courseTitle)}"</strong> (zamówienie nr ${esc(orderNumber)}).</p>
      <p>Twoje miejsce na kursie jest zarezerwowane. Faktura zostanie przesłana
         na koniec miesiąca, w którym nastąpiła płatność.</p>
      <p>Do zobaczenia na kursie!</p>
      <p style="margin-top:24px">Pozdrawiamy,<br /><strong>Zespół CEEA Poznań</strong></p>`,
  }).html,
  text: `Dzień dobry ${p.firstName || ""},

potwierdzamy zaksięgowanie wpłaty ${money(p.amount)} za kurs "${p.courseTitle}"
(zamówienie nr ${orderNumber}). Twoje miejsce jest zarezerwowane.

Do zobaczenia na kursie!
Pozdrawiamy,
Zespół CEEA Poznań`,
});

const organizerNotification = (p, orderNumber, extra = "") => ({
  subject: `[CEEA] ${p.paymentMethod === "tpay" ? "Płatność online" : "Zgłoszenie"}: ${p.courseTitle} (nr ${orderNumber})`,
  html: renderEmail({
    preheader: `Zgłoszenie nr ${orderNumber}`,
    title: "Powiadomienie dla sekretariatu",
    content: `
      <p><strong>${esc(p.firstName || "")} ${esc(p.surName || "")}</strong><br />
         ${esc(p.email || "-")}<br />tel. ${esc(p.phone || "-")}</p>
      <p>Kurs: <strong>${esc(p.courseTitle)}</strong><br />
         Płatność: <strong>${p.paymentMethod === "tpay" ? "Online (tpay)" : "Przelew tradycyjny"}</strong><br />
         Kwota: <strong>${money(p.amount)}</strong></p>
      ${extra}`,
  }).html,
});

module.exports = { success, organizerNotification };
