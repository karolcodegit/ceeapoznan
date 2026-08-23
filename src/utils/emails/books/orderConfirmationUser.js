const orderConfirmationUser = ({
  firstName,
  lastName,
  email,
  phone,
  orderNumber,
  deliveryMethod,
  items,
  deliveryCost,
  addressHomeParcel,
  total,
}) => {
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
              background-color: #ffffff;
              border: 1px solid #e0e0e0;
            }
            h1, h2, h3 {
              font-size: 22px;
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
            /* Zawijanie długich wartości (e-mail, nr zamówienia) — działa wszędzie */
            .details-table th,
            .details-table td,
            .products-table th,
            .products-table td {
              word-break: break-word;
              overflow-wrap: anywhere;
            }

            /* ---------- MOBILE: telefony do 480px ---------- */
            @media only screen and (max-width: 480px) {
              .container {
                margin: 0 !important;
                padding: 12px !important;
                border: none !important;
                max-width: 100% !important;
              }
              h1, h2, h3 {
                font-size: 18px !important;
                margin-bottom: 12px !important;
              }
              p {
                font-size: 15px !important;
                margin: 0 0 14px !important;
              }
              /* Tabele z danymi: etykieta NAD wartością, pełna szerokość */
              .details-table th,
              .details-table td {
                display: block !important;
                width: 100% !important;
                box-sizing: border-box !important;
              }
              .details-table th {
                border-bottom: none !important;
                background-color: #f5f5f5 !important;
                font-size: 12px !important;
                text-transform: uppercase !important;
                letter-spacing: 0.5px !important;
                color: #777777 !important;
                padding: 8px 8px 2px 8px !important;
              }
              .details-table td {
                border-top: none !important;
                padding: 2px 8px 10px 8px !important;
                margin-bottom: 6px !important;
              }
              /* Tabela produktów: mniejsze fonty i paddingi, żeby się zmieściła */
              .products-table th,
              .products-table td {
                padding: 4px !important;
                font-size: 12px !important;
              }
            }
          </style>
        </head>
        <body>
          <!-- Ukryty preheader: tekst podglądu w skrzynce odbiorczej -->
          <div style="display:none; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; mso-hide:all;">
            Potwierdzenie zamówienia nr ${orderNumber} – dziękujemy za zakup w CEEA Poznań.
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
            <h2>Witaj ${firstName},</h2>
            <p>
              Dziękujemy za złożenie zamówienia w sklepie CEEA Poznań.
              Twoje zamówienie o numerze <strong>${orderNumber}</strong> zostało przyjęte
              do realizacji. Poniżej znajduje się pełne podsumowanie zamówienia –
              zachowaj tę wiadomość jako potwierdzenie zakupu.
            </p>

            <h3 style="margin-top: 30px;">Dane klienta</h3>
            <table class="details-table" role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tbody>
                <tr><th style="text-align: left; padding: 8px; border: 1px solid #e0e0e0;">Numer zamówienia</th><td style="padding: 8px; border: 1px solid #e0e0e0;">${orderNumber}</td></tr>
                <tr><th style="text-align: left; padding: 8px; border: 1px solid #e0e0e0;">Imię</th><td style="padding: 8px; border: 1px solid #e0e0e0;">${firstName}</td></tr>
                <tr><th style="text-align: left; padding: 8px; border: 1px solid #e0e0e0;">Nazwisko</th><td style="padding: 8px; border: 1px solid #e0e0e0;">${lastName}</td></tr>
                <tr><th style="text-align: left; padding: 8px; border: 1px solid #e0e0e0;">Email</th><td style="padding: 8px; border: 1px solid #e0e0e0;">${email}</td></tr>
                <tr><th style="text-align: left; padding: 8px; border: 1px solid #e0e0e0;">Telefon</th><td style="padding: 8px; border: 1px solid #e0e0e0;">${phone}</td></tr>
              </tbody>
            </table>

            <h3>Dane dostawy</h3>
            <table class="details-table" role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tbody>
                <tr><th style="text-align: left; padding: 8px; border: 1px solid #e0e0e0;">Metoda dostawy</th><td style="padding: 8px; border: 1px solid #e0e0e0;">${deliveryMethod}</td></tr>
                ${
                  deliveryMethod === "Kurier InPost" && addressHomeParcel.address
                    ? `
                    <tr><th style="text-align: left; padding: 8px; border: 1px solid #e0e0e0;">Ulica</th><td style="padding: 8px; border: 1px solid #e0e0e0;">${addressHomeParcel.address.street}</td></tr>
                    <tr><th style="text-align: left; padding: 8px; border: 1px solid #e0e0e0;">Miasto</th><td style="padding: 8px; border: 1px solid #e0e0e0;">${addressHomeParcel.address.city}</td></tr>
                    <tr><th style="text-align: left; padding: 8px; border: 1px solid #e0e0e0;">Kod pocztowy</th><td style="padding: 8px; border: 1px solid #e0e0e0;">${addressHomeParcel.address.postcode}</td></tr>
                    `
                    : ""
                }
                ${
                  deliveryMethod === "Paczkomat" && addressHomeParcel.parcelLocker
                    ? `
                    <tr><th style="text-align: left; padding: 8px; border: 1px solid #e0e0e0;">Paczkomat</th><td style="padding: 8px; border: 1px solid #e0e0e0;">${
                      addressHomeParcel.parcelLocker?.name
                    }</td></tr>
                    <tr><th style="text-align: left; padding: 8px; border: 1px solid #e0e0e0;">Adres paczkomatu</th>
                      <td style="padding: 8px; border: 1px solid #e0e0e0;">
                        ${addressHomeParcel.parcelLocker?.address.street || ""} ${
                        addressHomeParcel.parcelLocker?.address.building_number || ""
                      }<br />
                        ${addressHomeParcel.parcelLocker?.address.city || ""}, ${
                        addressHomeParcel.parcelLocker?.address.post_code || ""
                      }
                      </td>
                    </tr>
                    `
                    : ""
                }
              </tbody>
            </table>

            <h3>Produkty</h3>
            <table class="products-table" role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr>
                  <th style="text-align: left; padding: 8px; border: 1px solid #e0e0e0;">Nazwa</th>
                  <th style="text-align: left; padding: 8px; border: 1px solid #e0e0e0;">Ilość</th>
                  <th style="text-align: left; padding: 8px; border: 1px solid #e0e0e0;">Cena jedn.</th>
                  <th style="text-align: left; padding: 8px; border: 1px solid #e0e0e0;">Razem</th>
                </tr>
              </thead>
              <tbody>
                ${items
                  .map(
                    item => `
                    <tr>
                      <td style="padding: 8px; border: 1px solid #e0e0e0;">${
                        item.title
                      }</td>
                      <td style="padding: 8px; border: 1px solid #e0e0e0;">${
                        item.quantity
                      }</td>
                      <td style="padding: 8px; border: 1px solid #e0e0e0;">${
                        item.price
                      } zł</td>
                      <td style="padding: 8px; border: 1px solid #e0e0e0;">${(
                        item.price * item.quantity
                      ).toFixed(2)} zł</td>
                    </tr>
                  `
                  )
                  .join("")}
              </tbody>
            </table>

            <p style="font-weight: bold; color: #333333; text-align: right; padding-top: 5px;">Koszt dostawy: ${deliveryCost.toFixed(
              2
            )} zł</p>
            <p style="font-weight: bold; color: #333333; text-align: right; padding-bottom: 20px;">Razem do zapłaty: ${total.toFixed(
              2
            )} zł</p>

            <p style="color: #333333;"><strong>Twoje zamówienie jest przetwarzane.</strong><br />
              Otrzymasz od nas aktualne informacje dotyczące statusu zamówienia i dostawy
              paczki po opłaceniu zamówienia. Przesyłkę nadajemy zazwyczaj w ciągu
              2 dni roboczych od zaksięgowania płatności.
            </p>

            <h3>Wpłaty prosimy dokonać na:</h3>
            <p>
              <b>Europejska Fundacja ds. Szkolenia w Anestezjologii</b><br />
              ul. Sokolnicka 56<br />
              62-021 Paczkowo<br />
              <b>Nr konta bankowego:</b> 47 1140 2004 0000 3202 8319 5381<br />
              <b>Kwota:</b> ${total.toFixed(2)} zł<br />
              <b>Tytuł przelewu:</b> Zamówienie nr ${orderNumber}
            </p>
            <p style="font-size: 14px;">
              Podanie numeru zamówienia w tytule przelewu pozwoli nam szybciej
              zidentyfikować Twoją płatność i skróci czas realizacji zamówienia.
            </p>

            <p>Pozdrawiamy,<br />Zespół CEEA Poznań</p>

            <!-- Footer -->
            <div class="footer">
              <p>
                W razie pytań dotyczących zamówienia prosimy o kontakt pod adresem
                <a href="mailto:sekretariat@ceea.org.pl">sekretariat@ceea.org.pl</a>
                lub telefonicznie: 61 869 13 57.
              </p>
              <p>
                Europejska Fundacja ds. Szkolenia w Anestezjologii<br />
                ul. Sokolnicka 56, 62-021 Paczkowo<br />
                NIP: 777-314-61-00 | REGON: 301341024 | KRS: 0000347155
              </p>
              <p>
                Otrzymałeś tę wiadomość, ponieważ złożyłeś zamówienie w sklepie CEEA Poznań.
                To wiadomość transakcyjna dotycząca Twojego zamówienia.
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
// Wersja tekstowa (text/plain) — bez zmian
// ---------------------------------------------------------------------------
const orderConfirmationUserText = ({
  firstName,
  lastName,
  email,
  phone,
  orderNumber,
  deliveryMethod,
  items,
  deliveryCost,
  addressHomeParcel,
  total,
}) => {
  const deliveryLines = []

  if (deliveryMethod === "Kurier InPost" && addressHomeParcel.address) {
    deliveryLines.push(
      `Ulica: ${addressHomeParcel.address.street}`,
      `Miasto: ${addressHomeParcel.address.city}`,
      `Kod pocztowy: ${addressHomeParcel.address.postcode}`
    )
  }

  if (deliveryMethod === "Paczkomat" && addressHomeParcel.parcelLocker) {
    const p = addressHomeParcel.parcelLocker
    deliveryLines.push(
      `Paczkomat: ${p?.name || ""}`,
      `Adres paczkomatu: ${p?.address.street || ""} ${p?.address.building_number || ""}, ${p?.address.city || ""}, ${p?.address.post_code || ""}`
    )
  }

  const productLines = items
    .map(
      item =>
        `- ${item.title} | ilość: ${item.quantity} | cena jedn.: ${item.price} zł | razem: ${(
          item.price * item.quantity
        ).toFixed(2)} zł`
    )
    .join("\n")

  return `Witaj ${firstName},

Dziękujemy za złożenie zamówienia w sklepie CEEA Poznań. Twoje zamówienie o numerze ${orderNumber} zostało przyjęte do realizacji.

DANE KLIENTA
Numer zamówienia: ${orderNumber}
Imię: ${firstName}
Nazwisko: ${lastName}
Email: ${email}
Telefon: ${phone}

DANE DOSTAWY
Metoda dostawy: ${deliveryMethod}
${deliveryLines.join("\n")}

PRODUKTY
${productLines}

Koszt dostawy: ${deliveryCost.toFixed(2)} zł
Razem do zapłaty: ${total.toFixed(2)} zł

Twoje zamówienie jest przetwarzane. Otrzymasz od nas aktualne informacje dotyczące statusu zamówienia i dostawy paczki po opłaceniu zamówienia.

WPŁATY PROSIMY DOKONAĆ NA:
Europejska Fundacja ds. Szkolenia w Anestezjologii
ul. Sokolnicka 56, 62-021 Paczkowo
Nr konta bankowego: 47 1140 2004 0000 3202 8319 5381
Kwota: ${total.toFixed(2)} zł
Tytuł przelewu: Zamówienie nr ${orderNumber}

Pozdrawiamy,
Zespół CEEA Poznań

--
W razie pytań: sekretariat@ceea.org.pl | tel. 61 869 13 57
Europejska Fundacja ds. Szkolenia w Anestezjologii, ul. Sokolnicka 56, 62-021 Paczkowo
NIP: 777-314-61-00 | REGON: 301341024 | KRS: 0000347155
© ${new Date().getFullYear()} CEEA Poznań. Wszelkie prawa zastrzeżone.`
}

export { orderConfirmationUserText }
export default orderConfirmationUser