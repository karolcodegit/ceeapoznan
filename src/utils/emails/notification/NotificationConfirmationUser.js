const BookNotificationUser = ({ title_book } = {}) => {
  const year = new Date().getFullYear()

  const rawHtml = `
   <!DOCTYPE html>
<html lang="pl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style>
      body, table, td, a {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      table, td {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, Helvetica, sans-serif;
        background-color: #f7f7f7;
        color: #333333;
        line-height: 1.6;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #e0e0e0;
        background-color: #ffffff;
      }
      .content {
        padding: 20px 0;
      }
      h1 {
        font-size: 20px;
        font-weight: 700;
        color: #333333;
        margin-bottom: 20px;
        text-align: left;
      }
      p {
        font-size: 16px;
        color: #555555;
        margin: 0 0 20px;
        text-align: left;
        word-break: break-word;
        overflow-wrap: anywhere;
      }
      p.bold {
        font-weight: 600;
        color: #333333;
      }
      a {
        color: #007bff;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
      .footer {
        font-size: 12px;
        color: #555555;
        text-align: center;
        margin-top: 40px;
        margin-bottom: 20px;
        border-top: 1px solid #e0e0e0;
        padding-top: 10px;
      }
      .footer p {
        font-size: 12px;
        text-align: center;
        margin: 0 0 10px;
      }
      img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
        border: 0;
      }

      /* ---------- MOBILE: telefony do 480px ---------- */
      @media only screen and (max-width: 480px) {
        .container {
          margin: 0 !important;
          padding: 12px !important;
          border: none !important;
          max-width: 100% !important;
        }
        .content {
          padding: 12px 0 !important;
        }
        h1 {
          font-size: 18px !important;
          margin-bottom: 12px !important;
        }
        p {
          font-size: 15px !important;
          margin: 0 0 14px !important;
        }
      }
    </style>
  </head>
  <body>
    <!-- Ukryty preheader: tekst podglądu w skrzynce odbiorczej -->
    <div style="display:none; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; mso-hide:all;">
      Zapisaliśmy Cię na listę oczekujących – powiadomimy Cię, gdy książka będzie dostępna.
      &#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;
    </div>

    <div class="container">
      <!-- Header -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
        <tr>
          <td align="center">
            <img
              src="cid:ceea-header"
              width="600"
              height="83"
              alt="CEEA Poznań – Europejska Fundacja ds. Szkolenia w Anestezjologii"
              style="width: 100%; max-width: 600px; height: auto; margin-bottom: 20px; object-fit: contain;"
            />
          </td>
        </tr>
      </table>

      <!-- Content -->
      <div class="content">
        <h1>Szanowna Pani, Szanowny Panie,</h1>
        <p>
          Dziękujemy za zainteresowanie naszą ofertą i chęć zakupu książki
          <b>"${title_book}"</b>. Z przykrością informujemy, że ten produkt
          jest obecnie niedostępny w naszej ofercie.
        </p>
        <p>
          Nie martw się jednak! Zapisaliśmy Cię na listę oczekujących — gdy
          książka będzie ponownie dostępna, powiadomimy Cię mailowo i będziesz
          mógł/mogła złożyć zamówienie.
        </p>
        <p>
          Staramy się jak najszybciej uzupełniać stany magazynowe. W międzyczasie
          zapraszamy do zapoznania się z pełną ofertą na
          <a href="https://www.ceea.org.pl" target="_blank">www.ceea.org.pl</a>,
          gdzie znajdziesz inne interesujące publikacje.
        </p>
        <p>
          Dziękujemy za zrozumienie i cierpliwość.
        </p>
        <p>
          Z poważaniem,<br />
          Zespół CEEA Poznań
        </p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>
          W razie pytań prosimy o kontakt pod adresem
          <a href="mailto:sekretariat@ceea.org.pl">sekretariat@ceea.org.pl</a>
          lub telefonicznie: 61 869 13 57.
        </p>
        <p>
          Europejska Fundacja ds. Szkolenia w Anestezjologii<br />
          ul. Sokolnicka 56, 62-021 Paczkowo<br />
          NIP: 777-314-61-00 | REGON: 301341024 | KRS: 0000347155
        </p>
        <p>
          Otrzymałeś tę wiadomość, ponieważ zgłosiłeś chęć zakupu książki
          na stronie www.ceea.org.pl.
        </p>
        <p>© ${year} CEEA Poznań. Wszelkie prawa zastrzeżone.</p>
      </div>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
        <tr>
          <td align="center">
            <img
              src="cid:ceea-footer"
              width="400"
              height="56"
              alt="Konto bankowe CEEA: 47 1140 2004 0000 3202 8319 5381, kontakt: sekretariat@ceea.org.pl"
              style="width: 100%; max-width: 400px; height: auto; object-fit: contain;"
            />
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
    `
  return rawHtml
}

// ---------------------------------------------------------------------------
// Wersja tekstowa (text/plain) — obniża wynik spamowy
// ---------------------------------------------------------------------------
const BookNotificationUserText = ({ title_book } = {}) => {
  return `Szanowna Pani, Szanowny Panie,

Dziękujemy za zainteresowanie naszą ofertą i chęć zakupu książki "${title_book}". Z przykrością informujemy, że ten produkt jest obecnie niedostępny w naszej ofercie.

Nie martw się jednak! Zapisaliśmy Cię na listę oczekujących — gdy książka będzie ponownie dostępna, powiadomimy Cię mailowo i będziesz mógł/mogła złożyć zamówienie.

Staramy się jak najszybciej uzupełniać stany magazynowe. W międzyczasie zapraszamy do zapoznania się z pełną ofertą na www.ceea.org.pl.

Dziękujemy za zrozumienie i cierpliwość.

Z poważaniem,
Zespół CEEA Poznań

--
W razie pytań: sekretariat@ceea.org.pl | tel. 61 869 13 57
Europejska Fundacja ds. Szkolenia w Anestezjologii, ul. Sokolnicka 56, 62-021 Paczkowo
NIP: 777-314-61-00 | REGON: 301341024 | KRS: 0000347155
© ${new Date().getFullYear()} CEEA Poznań. Wszelkie prawa zastrzeżone.`
}

export { BookNotificationUserText }
export default BookNotificationUser
