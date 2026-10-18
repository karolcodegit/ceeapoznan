// cloud/src/email/templates/course.js — potwierdzenie zapisu + dane do przelewu
const { renderEmail, infoBox, esc, ORG } = require("../layout");

const BANK = () => process.env.BANK_ACCOUNT || "47 1140 2004 0000 3202 8319 5381";

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
        <p style="margin:0 0 6px;font-size:14px">Kwota: <strong>${esc(p.amount)} zł</strong></p>
        <p style="margin:0;font-size:14px">Tytuł przelewu: <strong>${esc(p.firstName || "")} ${esc(p.surName || "")}, zamówienie nr ${esc(orderNumber)}</strong></p>
      `)}
      <p style="font-size:13px;color:#6b7280">Podanie imienia i nazwiska oraz numeru zamówienia w tytule przelewu pozwoli nam
         szybciej zidentyfikować Twoją płatność – potwierdzenie otrzymasz automatycznie
         po zaksięgowaniu wpłaty.</p>
      <p>Potwierdzenie uczestnictwa wraz z fakturą zostaną wysłane na koniec
         miesiąca, w którym nastąpiło opłacenie udziału w kursie.</p>
      <p>Mamy nadzieję, że spełnimy Państwa oczekiwania. W przypadku pytań
         pozostajemy do Państwa dyspozycji.</p>
      <p style="margin-top:24px">Pozdrawiamy,<br /><strong>Zespół CEEA Poznań</strong></p>`,
  }).html,
  text: `Szanowna Uczestniczko, Szanowny Uczestniku,

Serdecznie dziękujemy za zgłoszenie na kurs "${p.courseTitle}".
Numer zgłoszenia: ${orderNumber}

Wpłaty prosimy dokonywać na konto:
${ORG.name}
${ORG.address}
Nr konta: ${BANK()}
Kwota: ${p.amount} zł
Tytuł przelewu: ${p.firstName || ""} ${p.surName || ""}, zamówienie nr ${orderNumber}

Potwierdzenie otrzymasz automatycznie po zaksięgowaniu wpłaty.

Pozdrawiamy,
Zespół CEEA Poznań`,
});

module.exports = { confirmationTransfer };
