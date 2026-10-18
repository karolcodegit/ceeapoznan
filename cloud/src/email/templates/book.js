// cloud/src/email/templates/book.js — zamówienia książek (2 warianty) + lista oczekujących
const { renderEmail, infoBox, button, money, esc, ORG } = require("../layout");

const BANK = () => process.env.BANK_ACCOUNT || "47 1140 2004 0000 3202 8319 5381";
const n = v => (v === undefined || v === null || v === "" ? "" : String(v));

const itemsList = items =>
  (items || []).map(i =>
    `<p style="margin:0 0 6px;font-size:14px"><strong>${esc(i.title)}</strong> × ${i.qty || i.quantity || 1}</p>`
  ).join("");

const fullName = d => [n(d.firstName || d.name), n(d.lastName || d.surname)].filter(Boolean).join(" ");

// ── UCZESTNIK: przelew tradycyjny ──
const orderConfirmationTransfer = d => ({
  subject: `Twoje zamówienie ${n(d.orderNumber) ? `nr ${d.orderNumber} ` : ""}– CEEA Poznań`,
  html: renderEmail({
    preheader: "Potwierdzenie zamówienia – dane do przelewu",
    title: `Dzień dobry${fullName(d) ? ` ${esc(fullName(d))}` : ""},`,
    content: `
      <p>przyjęliśmy Twoje zamówienie${d.orderNumber ? ` (nr <strong>${esc(d.orderNumber)}</strong>)` : ""}:</p>
      ${infoBox(itemsList(d.items) + `<p style="margin:10px 0 0;font-size:15px"><strong>Do zapłaty: ${money(d.amount)}</strong></p>`)}
      <p><strong>Dane do przelewu:</strong><br>
      ${ORG.name}<br>${ORG.address}<br>
      mBank: <strong>${BANK()}</strong><br>
      Tytuł: <strong>Zamówienie książki${fullName(d) ? ` – ${esc(fullName(d))}` : ""}${d.orderNumber ? `, nr ${esc(d.orderNumber)}` : ""}</strong></p>
      <p>Wysyłkę realizujemy po zaksięgowaniu wpłaty.</p>
      <p style="margin-top:24px">Pozdrawiamy,<br /><strong>Zespół CEEA Poznań</strong></p>`,
  }).html,
  text: `Dzień dobry,

przyjęliśmy zamówienie: ${(d.items || []).map(i => i.title).join(", ")}.
Do zapłaty: ${money(d.amount)}.
Nr konta: ${BANK()} (mBank, ${ORG.name})

Pozdrawiamy,
Zespół CEEA Poznań`,
});

// ── UCZESTNIK: płatność online (żadnych danych do przelewu!) ──
const orderConfirmationOnline = d => ({
  subject: `Twoje zamówienie ${n(d.orderNumber) ? `nr ${d.orderNumber} ` : ""}– CEEA Poznań`,
  html: renderEmail({
    preheader: "Potwierdzenie zamówienia – płatność online",
    title: `Dzień dobry${fullName(d) ? ` ${esc(fullName(d))}` : ""},`,
    content: `
      <p>przyjęliśmy Twoje zamówienie${d.orderNumber ? ` (nr <strong>${esc(d.orderNumber)}</strong>)` : ""}:</p>
      ${infoBox(itemsList(d.items) + `<p style="margin:10px 0 0;font-size:15px"><strong>Kwota: ${money(d.amount)}</strong>${d.fee ? `<br><span style="font-size:12px;color:#6b7280">w tym opłata obsługi płatności online: ${money(d.fee)}</span>` : ""}</p>`)}
      <p>Dokonaj płatności online – po jej zaksięgowaniu przystępujemy do wysyłki.</p>
      ${d.resumeUrl ? button("Dokończ płatność", d.resumeUrl) : ""}
      <p style="margin-top:24px">Pozdrawiamy,<br /><strong>Zespół CEEA Poznań</strong></p>`,
  }).html,
  text: `Dzień dobry,

przyjęliśmy zamówienie: ${(d.items || []).map(i => i.title).join(", ")}.
Kwota: ${money(d.amount)}${d.fee ? ` (w tym opłata obsługi płatności online: ${money(d.fee)})` : ""}.

Dokończ płatność online${d.resumeUrl ? `: ${d.resumeUrl}` : ""}.

Pozdrawiamy,
Zespół CEEA Poznań`,
});

// ── SEKRETARIAT: pełne dane (kto, jak zapłacił, gdzie wysłać) ──
const orderOrganizer = d => {
  const m = d.paymentMethod === "tpay" ? "Online (tpay)" : "Przelew tradycyjny";
  const ship = d.delivery?.method === "courier" ? "Kurier InPost" : "Paczkomat InPost";
  const dest = d.delivery?.method === "courier"
    ? `${n(d.delivery?.address?.street)}, ${n(d.delivery?.address?.postcode)} ${n(d.delivery?.address?.city)}`
    : d.delivery?.locker
      ? `${n(d.delivery.locker.name)} (${n(d.delivery.locker.code)}) – ${n(d.delivery.locker.address?.street)} ${n(d.delivery.locker.address?.building_number)}, ${n(d.delivery.locker.address?.post_code)} ${n(d.delivery.locker.address?.city)}`
      : "—";
  return {
    subject: `📚 Zamówienie książki: ${fullName(d) || d.email} (${money(d.amount)})`,
    html: renderEmail({
      preheader: "Nowe zamówienie książki – do wysyłki",
      title: "Nowe zamówienie książki",
      content: `
        <p><strong>Imię i nazwisko: ${esc(fullName(d))}</strong><br>
        Email: ${esc(d.email)}${n(d.phone) ? `<br>Telefon: ${esc(d.phone)}` : ""}</p>
        ${infoBox(itemsList(d.items) + `<p style="margin:10px 0 0;font-size:15px"><strong>Razem: ${money(d.amount)}</strong>${d.fee ? ` <span style="font-size:12px;color:#6b7280">(opłata online ${money(d.fee)})</span>` : ""}</p>`)}
        <p>
          <strong>Płatność:</strong> ${m}<br>
          <strong>Dostawa:</strong> ${ship}<br>
          <strong>${d.delivery?.method === "courier" ? "Adres" : "Paczkomat"}:</strong> ${esc(dest)}
        </p>
        ${d.orderNumber ? `<p style="font-size:13px;color:#6b7280">Nr zamówienia: ${esc(d.orderNumber)}</p>` : ""}`,
    }).html,
    text: `ZAMÓWIENIE KSIĄŻKI
${fullName(d)}
${d.email}${n(d.phone) ? `, tel. ${d.phone}` : ""}

Książki: ${(d.items || []).map(i => `${i.title} x${i.qty || i.quantity || 1}`).join(", ")}
Razem: ${money(d.amount)}${d.fee ? ` (opłata online ${money(d.fee)})` : ""}
Płatność: ${m}
Dostawa: ${ship}
Adres: ${dest}
${d.orderNumber ? `Nr zamówienia: ${d.orderNumber}` : ""}`,
  };
};

// ── LISTA OCZEKUJĄCYCH ──
const notifyConfirmation = ({ title }) => ({
  subject: `Lista oczekujących – "${title}" – CEEA Poznań`,
  html: renderEmail({
    preheader: `Powiadomimy Cię, gdy "${title}" będzie dostępna`,
    title: "Dzień dobry,",
    content: `
      <p>zapisałeś się na listę oczekujących na książkę <strong>"${esc(title)}"</strong>.</p>
      <p>Poinformujemy Cię mailowo, gdy tylko pojawi się w sprzedaży.</p>
      <p style="margin-top:24px">Pozdrawiamy,<br /><strong>Zespół CEEA Poznań</strong></p>`,
  }).html,
  text: `Dzień dobry,

zapisałeś się na listę oczekujących na "${title}".
Poinformujemy Cię, gdy książka będzie dostępna.

Pozdrawiamy,
Zespół CEEA Poznań`,
});

module.exports = { orderConfirmationTransfer, orderConfirmationOnline, orderOrganizer, notifyConfirmation };