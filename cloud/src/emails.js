  // cloud/src/emails.js – szablony maili
  // UWAGA: header/footer (cid:ceea-header / cid:ceea-footer) dokleja mailer.js –
  // w szablonach odwołujemy się do nich jak dotychczas.
  const { formatMoney } = require("./fees");

  const person = (p) => `${p.firstName || ""} ${p.surName || ""}`.trim();
  const year = new Date().getFullYear();

  const STYLES = `
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    body { margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f7f7f7; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 20px auto; padding: 20px; background: #fff; border: 1px solid #e0e0e0; }
    h1 { font-size: 20px; font-weight: 700; margin: 30px 0 20px; }
    p { font-size: 16px; color: #555; margin: 0 0 20px; word-break: break-word; }
    .footer { font-size: 12px; color: #555; text-align: center; margin-top: 40px; border-top: 1px solid #e0e0e0; padding-top: 10px; }
    .footer p { font-size: 12px; text-align: center; margin: 0 0 10px; }
    img { max-width: 100%; height: auto; display: block; margin: 0 auto; border: 0; }
    @media only screen and (max-width: 480px) {
      .container { margin: 0 !important; padding: 12px !important; border: none !important; max-width: 100% !important; }
      h1 { font-size: 18px !important; margin: 20px 0 12px !important; }
      p { font-size: 15px !important; margin: 0 0 14px !important; }
    }`;

  const FOOTER_HTML = `
    <div class="footer">
      <p>W razie pytań prosimy o kontakt: <a href="mailto:sekretariat@ceea.org.pl">sekretariat@ceea.org.pl</a> lub tel. 61 869 13 57.</p>
      <p>Europejska Fundacja ds. Szkolenia w Anestezjologii<br>ul. Sokolnicka 56, 62-021 Paczkowo<br>NIP: 777-314-61-00 | REGON: 301341024 | KRS: 0000347155</p>
      <p>© ${year} CEEA Poznań. Wszelkie prawa zastrzeżone.</p>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
      <tr><td align="center">
        <img src="cid:ceea-footer" width="400" height="56" alt="CEEA Poznań"
          style="width: 100%; max-width: 400px; height: auto; object-fit: contain;" />
      </td></tr>
    </table>`;

  const HEADER_HTML = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
      <tr><td align="center">
        <img src="cid:ceea-header" width="600" height="83" alt="CEEA Poznań"
          style="width: 100%; max-width: 600px; height: auto; margin-bottom: 20px; object-fit: contain;" />
      </td></tr>
    </table>`;

  const page = ({ preheader, content }) => `<!DOCTYPE html>
  <html lang="pl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>${STYLES}</style>
  </head>
  <body>
    <div style="display:none; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; mso-hide:all;">${preheader}</div>
    <div class="container">
      ${HEADER_HTML}
      ${content}
      ${FOOTER_HTML}
    </div>
  </body>
  </html>`;

  const plainFooter = `
  --
  W razie pytań: sekretariat@ceea.org.pl | tel. 61 869 13 57
  Europejska Fundacja ds. Szkolenia w Anestezjologii, ul. Sokolnicka 56, 62-021 Paczkowo
  NIP: 777-314-61-00 | REGON: 301341024 | KRS: 0000347155
  © ${year} CEEA Poznań. Wszelkie prawa zastrzeżone.`;

  // ── 1. Przelew tradycyjny: potwierdzenie + dane do przelewu ──
  // (odpowiednik Twojego CourseConfirmationUser – szablon 1:1)
  const courseConfirmationTransfer = (p, orderNumber) => ({
    subject: `Potwierdzenie zgłoszenia na kurs "${p.courseTitle}" – CEEA Poznań`,
    html: page({
      preheader: `Potwierdzenie zgłoszenia na kurs "${p.courseTitle}" – CEEA Poznań.`,
      content: `
        <h1>Szanowna Uczestniczko, Szanowny Uczestniku,</h1>
        <p>Serdecznie dziękujemy za zainteresowanie naszym kursem. Niniejszym
          potwierdzamy przyjęcie zgłoszenia chęci udziału w kursie
          <b>"${p.courseTitle}"</b>.</p>
        <p>Numer Twojego zgłoszenia: <b>${orderNumber}</b></p>
        <p>Przypominamy o konieczności opłacenia uczestnictwa w kursie.
          Wpłaty prosimy dokonywać na konto:</p>
        <p>
          <strong>Europejska Fundacja ds. Szkolenia w Anestezjologii</strong><br />
          ul. Sokolnicka 56<br />
          62-021 Paczkowo<br />
          <strong>Nr konta bankowego:</strong> ${process.env.BANK_ACCOUNT || "47 1140 2004 0000 3202 8319 5381"}<br />
          <strong>Kwota:</strong> ${formatMoney(p.amount)} zł<br />
          <strong>Tytuł przelewu:</strong> ${person(p)}, zamówienie nr ${orderNumber}
        </p>
        <p style="font-size: 14px;">Podanie numeru zamówienia w tytule przelewu pozwoli nam
          szybciej zidentyfikować Twoją płatność – dzięki temu potwierdzenie
          otrzymasz automatycznie, od razu po zaksięgowaniu wpłaty.</p>
        <p>Potwierdzenie uczestnictwa wraz z fakturą zostaną wysłane na koniec
          miesiąca, w którym nastąpiło opłacenie udziału w kursie.</p>
        <p>Pozdrawiamy,<br />Zespół CEEA Poznań</p>`,
    }),
    text: `Szanowna Uczestniczko, Szanowny Uczestniku,

  Serdecznie dziękujemy za zgłoszenie na kurs "${p.courseTitle}".
  Numer zgłoszenia: ${orderNumber}

  Wpłaty prosimy dokonywać na konto:
  Europejska Fundacja ds. Szkolenia w Anestezjologii
  ul. Sokolnicka 56, 62-021 Paczkowo
  Nr konta: ${process.env.BANK_ACCOUNT || "47 1140 2004 0000 3202 8319 5381"}
  Kwota: ${formatMoney(p.amount)} zł
  Tytuł przelewu: ${person(p)}, zamówienie nr ${orderNumber}

  Potwierdzenie otrzymasz automatycznie po zaksięgowaniu wpłaty.
  ${plainFooter}`,
  });

  // ── 2. Potwierdzenie zaksięgowanej wpłaty (mark-paid / webhook) ──
  const paymentSuccess = (p, orderNumber) => ({
    subject: `Potwierdzenie płatności – kurs "${p.courseTitle}" – CEEA Poznań`,
    html: page({
      preheader: `Potwierdziliśmy otrzymanie wpłaty za kurs "${p.courseTitle}".`,
      content: `
        <h1>Szanowna Uczestniczko, Szanowny Uczestniku,</h1>
        <p>potwierdzamy zaksięgowanie wpłaty <b>${formatMoney(p.amount)} zł</b> za udział
          w kursie <b>"${p.courseTitle}"</b> (zamówienie nr ${orderNumber}).</p>
        <p>Twoje miejsce na kursie jest zarezerwowane. Faktura zostanie przesłana
          na koniec miesiąca, w którym nastąpiła płatność.</p>
        <p>Do zobaczenia na kursie!<br />Zespół CEEA Poznań</p>`,
    }),
    text: `Szanowna Uczestniczko, Szanowny Uczestniku,

  potwierdzamy zaksięgowanie wpłaty ${formatMoney(p.amount)} zł za kurs "${p.courseTitle}"
  (zamówienie nr ${orderNumber}). Twoje miejsce jest zarezerwowane.
  ${plainFooter}`,
  });

  // ── 3. Kopia do sekretariatu ──
  const organizerNotification = (p, orderNumber, extra = "") => ({
    subject: `[CEEA] ${p.paymentMethod === "tpay" ? "Płatność online" : "Zgłoszenie"}: ${p.courseTitle} (nr ${orderNumber})`,
    html: page({
      preheader: `Zgłoszenie nr ${orderNumber}`,
      content: `
        <p><b>${person(p)}</b><br />${p.email || "-"}<br />tel. ${p.phone || "-"}</p>
        <p>Kurs: <b>${p.courseTitle}</b><br />
          Płatność: <b>${p.paymentMethod === "tpay" ? "Online (tpay)" : "Przelew tradycyjny"}</b><br />
          Kwota: <b>${formatMoney(p.amount)} zł</b></p>
        ${extra}`,
    }),
  });

  module.exports = { courseConfirmationTransfer, paymentSuccess, organizerNotification };
