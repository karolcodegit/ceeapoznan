// cloud/src/email/templates/course.js — maile kursowe (NOWY layout: logo na górze)
const { renderEmail, infoBox, esc, ORG } = require("../layout");

const BANK = () => process.env.BANK_ACCOUNT || "47 1140 2004 0000 3202 8319 5381";
const money = v => (typeof v === "number" ? v.toFixed(2).replace(".", ",") : String(v ?? ""));
const fullName = p => `${p.firstName || ""} ${p.surName || ""}`.trim();

// ── UCZESTNIK: przelew tradycyjny ──
const confirmationTransfer = (p, orderNumber) => ({
  subject: `Potwierdzenie zgłoszenia na kurs "${p.courseTitle}" – CEEA Poznań`,
  html: renderEmail({
    preheader: `Potwierdzenie zgłoszenia na kurs "${p.courseTitle}" – CEEA Poznań.`,
    title: "Szanowna Uczestniczko, Szanowny Uczestniku,",
    content: `
      <p>Serdecznie dziękujemy za zainteresowanie naszym kursem. Niniejszym
         potwierdzamy przyjęcie zgłoszenia chęci udziału w kursie
         <strong>"${esc(p.courseTitle)}"</strong>.</p>
      <p>Numer Twojego zgłoszenia: <strong>${esc(orderNumber)}</strong></p>
      <p>Przypominamy o konieczności opłacenia uczestnictwa w kursie.
         Wpłaty prosimy dokonywać na konto:</p>
      ${infoBox(`
        <p style="margin:0 0 6px;font-size:14px"><strong>${ORG.name}</strong><br>${ORG.address}</p>
        <p style="margin:0 0 6px;font-size:14px">Nr konta: <strong>${BANK()}</strong></p>
        <p style="margin:0 0 6px;font-size:14px">Kwota: <strong>${money(p.amount)} zł</strong></p>
        <p style="margin:0;font-size:14px">Tytuł przelewu: <strong>${esc(fullName(p))}, zamówienie nr ${esc(orderNumber)}</strong></p>
      `)}
      <p style="font-size:13px;color:#6b7280">Podanie imienia i nazwiska oraz numeru zamówienia w tytule przelewu pozwoli nam
         szybciej zidentyfikować Twoją płatność – potwierdzenie otrzymasz automatycznie
         po zaksięgowaniu wpłaty.</p>
      <p>Potwierdzenie uczestnictwa wraz z fakturą zostaną wysłane na koniec
         miesiąca, w którym nastąpiło opłacenie udziału w kursie.</p>
      <p style="margin-top:24px">Pozdrawiamy,<br /><strong>Zespół CEEA Poznań</strong></p>`,
  }).html,
  text: `Szanowna Uczestniczko, Szanowny Uczestniku,

Serdecznie dziękujemy za zgłoszenie na kurs "${p.courseTitle}".
Numer zgłoszenia: ${orderNumber}

Wpłaty prosimy dokonywać na konto:
${ORG.name}
${ORG.address}
Nr konta: ${BANK()}
Kwota: ${money(p.amount)} zł
Tytuł przelewu: ${fullName(p)}, zamówienie nr ${orderNumber}

Potwierdzenie otrzymasz automatycznie po zaksięgowaniu wpłaty.

Pozdrawiamy,
Zespół CEEA Poznań`,
});

// ── UCZESTNIK: potwierdzenie zaksięgowanej wpłaty (mark-paid / webhook) ──
const confirmationPaid = (p, orderNumber) => ({
  subject: `Potwierdzenie płatności – kurs "${p.courseTitle}" – CEEA Poznań`,
  html: renderEmail({
    preheader: `Potwierdziliśmy otrzymanie wpłaty za kurs "${p.courseTitle}".`,
    title: "Szanowna Uczestniczko, Szanowny Uczestniku,",
    content: `
      <p>potwierdzamy zaksięgowanie wpłaty <strong>${money(p.amount)} zł</strong> za udział
         w kursie <strong>"${esc(p.courseTitle)}"</strong> (zamówienie nr ${esc(orderNumber)}).</p>
      <p>Twoje miejsce na kursie jest zarezerwowane. Faktura zostanie przesłana
         na koniec miesiąca, w którym nastąpiła płatność.</p>
      <p>Do zobaczenia na kursie!</p>
      <p style="margin-top:24px">Pozdrawiamy,<br /><strong>Zespół CEEA Poznań</strong></p>`,
  }).html,
  text: `Szanowna Uczestniczko, Szanowny Uczestniku,

potwierdzamy zaksięgowanie wpłaty ${money(p.amount)} zł za kurs "${p.courseTitle}"
(zamówienie nr ${orderNumber}). Twoje miejsce jest zarezerwowane.

Pozdrawiamy,
Zespół CEEA Poznań`,
});

// ── SEKRETARIAT: kopia zgłoszenia ──
const courseOrganizer = (p, orderNumber) => ({
  subject: `Zgłoszenie na kurs: ${p.courseTitle} (nr ${orderNumber})`,
  html: renderEmail({
    preheader: `Nowe zgłoszenie nr ${orderNumber}`,
    title: "Nowe zgłoszenie na kurs",
    content: `
      <p><strong>${esc(fullName(p))}</strong><br>
      Email: ${esc(p.email || "–")}<br>
      Telefon: ${esc(p.phone || "–")}</p>
      ${infoBox(`
        <p style="margin:0 0 6px;font-size:14px">Kurs: <strong>${esc(p.courseTitle)}</strong></p>
        <p style="margin:0 0 6px;font-size:14px">Płatność: <strong>${p.paymentMethod === "tpay" ? "Online (tpay)" : "Przelew tradycyjny"}</strong></p>
        <p style="margin:0;font-size:14px">Kwota: <strong>${money(p.amount)} zł</strong></p>
      `)}
      <p style="font-size:13px;color:#6b7280">Nr zamówienia: ${esc(orderNumber)}</p>`,
  }).html,
  text: `ZGŁOSZENIE NA KURS
${fullName(p)}
${p.email || "-"}, tel. ${p.phone || "-"}

Kurs: ${p.courseTitle}
Płatność: ${p.paymentMethod === "tpay" ? "Online (tpay)" : "Przelew tradycyjny"}
Kwota: ${money(p.amount)} zł
Nr zamówienia: ${orderNumber}`,
});

module.exports = { confirmationTransfer, confirmationPaid, courseOrganizer };
