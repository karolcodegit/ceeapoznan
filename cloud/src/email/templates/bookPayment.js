// cloud/src/email/templates/bookPayment.js — zaksięgowanie wpłaty za zamówienie książek

const { renderEmail, money, esc, ORG } = require("../layout");

const deliveryLine = (o) => {
  const m = (o.delivery_method || "").toLowerCase();
  if (m.includes("paczkomat") || m.includes("parcel") || m.includes("inpost"))
    return `Paczkomat InPost${o.parcel_locker_code ? ` (${esc(o.parcel_locker_code)})` : ""}`;
  if (m.includes("kurier") || m.includes("courier")) return "Kurier";
  if (m.includes("odbiór") || m.includes("pickup")) return "Odbiór osobisty";
  return esc(o.delivery_method || "-");
};

const itemsHtml = (items) =>
  (Array.isArray(items) ? items : [])
    .map((i) => {
      const t = esc(i.title || i.name || "Pozycja");
      const q = Number(i.qty || i.quantity) || 1;
      return `<li>${t}${q > 1 ? ` × ${q}` : ""}</li>`;
    })
    .join("");

const itemsText = (items) =>
  (Array.isArray(items) ? items : [])
    .map((i) => {
      const q = Number(i.qty || i.quantity) || 1;
      return `- ${i.title || i.name || "Pozycja"}${q > 1 ? ` x ${q}` : ""}`;
    })
    .join("\n");

// Potwierdzenie dla klienta
const success = (o) => ({
  subject: `Potwierdzenie płatności – zamówienie ${o.order_number} – CEEA Poznań`,
  html: renderEmail({
    preheader: `Potwierdziliśmy otrzymanie wpłaty za zamówienie ${o.order_number}.`,
    title: `Dzień dobry ${esc(o.name || "")},`.trim(),
    content: `
      <p>potwierdzamy zaksięgowanie wpłaty <strong>${money(o.amount)}</strong>
         za zamówienie <strong>${esc(o.order_number)}</strong>.</p>
      <p><strong>Zamówione pozycje:</strong></p>
      <ul>${itemsHtml(o.items)}</ul>
      <p>Sposób dostawy: <strong>${deliveryLine(o)}</strong>.</p>
      <p>Twoje zamówienie zostało przekazane do realizacji — paczkę nadamy niebawem,
         a numer śledzenia prześlemy w kolejnej wiadomości.</p>
      <p style="margin-top:24px">Pozdrawiamy,<br /><strong>Zespół CEEA Poznań</strong></p>`,
  }).html,
  text: `Dzien dobry ${o.name || ""},

potwierdzamy zaksięgowanie wpłaty ${money(o.amount)} za zamówienie ${o.order_number}.

Zamowione pozycje:
${itemsText(o.items)}

Zamowienie zostalo przekazane do realizacji. Numer sledzenia przeslemy w kolejnej wiadomosci.

Pozdrawiamy,
Zespol CEEA Poznan`,
});

// Kopia do sekretariatu
const organizerNotification = (o) => ({
  subject: `[CEEA] Książki opłacone: ${o.order_number} (${o.name || ""} ${o.surname || ""})`,
  html: renderEmail({
    preheader: `Zaksięgowano wpłatę za zamówienie ${o.order_number}`,
    title: "Powiadomienie dla sekretariatu",
    content: `
      <p><strong>${esc(o.name || "")} ${esc(o.surname || "")}</strong><br />
         ${esc(o.email || "-")}<br />tel. ${esc(o.phone || "-")}</p>
      <p>Zamówienie: <strong>${esc(o.order_number)}</strong><br />
         Kwota: <strong>${money(o.amount)}</strong><br />
         Dostawa: <strong>${deliveryLine(o)}</strong></p>
      <p><strong>Pozycje:</strong></p>
      <ul>${itemsHtml(o.items)}</ul>
      <p>Wysyłka została odblokowana — można utworzyć przesyłkę InPost.</p>`,
  }).html,
});

module.exports = { success, organizerNotification };