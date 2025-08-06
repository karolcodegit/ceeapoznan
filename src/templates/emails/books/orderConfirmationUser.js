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
  const rawHtml = `
    <!DOCTYPE html>
<html lang="pl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
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
        font-family: 'Aptos', Arial, Helvetica, sans-serif;
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
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
        font-size: 10px;
        color: #555555;
        text-align: center;
        margin-top: 100px;
        margin-bottom:50px;
        border-top: 1px solid #e0e0e0;
        padding-top:10px;

      }
        .footer p{
          font-size: 10px;
          text-align: center;
          margin: 0 0 10px;

        }
      img {
        max-width: 100%; /* Obrazy nie będą większe niż szerokość kontenera */
        height: auto; /* Zachowanie proporcji obrazu */
        display: block; /* Usunięcie odstępów poniżej obrazów */
        margin: 0 auto; /* Wyśrodkowanie obrazów */
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center">
            <img
              src="http://cdn.mcauto-images-production.sendgrid.net/6c0632f6ca434cdc/aed2177f-9a2d-45d8-b0ef-0044f3e031aa/2140x296.png"
              alt="Logo"
              style="width: 800px; height: auto; margin-bottom: 20px; max-height: 150px; object-fit: contain;"
            />
          </td>
        </tr>
      </table>

      <!-- Content -->
      <h2>Witaj ${firstName},</h2>
      <p>Dziękujemy za złożenie zamówienia! Poniżej znajduje się jego podsumowanie.</p>

      <h3 class="margin-top:50px">Dane klienta</h3>
      <table class="details-table" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tbody>
          <tr><th style="text-align: left; padding: 8px; border: 1px solid #e0e0e0;">Numer zamówienia</th><td style="padding: 8px; border: 1px solid #e0e0e0;">${orderNumber}</td></tr>
          <tr><th style="text-align: left; padding: 8px; border: 1px solid #e0e0e0;">Imię</th><td style="padding: 8px; border: 1px solid #e0e0e0;">${firstName}</td></tr>
          <tr><th style="text-align: left; padding: 8px; border: 1px solid #e0e0e0;">Nazwisko</th><td style="padding: 8px; border: 1px solid #e0e0e0;">${lastName}</td></tr>
          <tr><th style="text-align: left; padding: 8px; border: 1px solid #e0e0e0;">Email</th><td style="padding: 8px; border: 1px solid #e0e0e0;">${email}</td></tr>
          <tr><th style="text-align: left; padding: 8px; border: 1px solid #e0e0e0;">Telefon</th><td style="padding: 8px; border: 1px solid #e0e0e0;">${phone}</td></tr>
        </tbody>
      </table>

      <h3>Dane dostawy</h3>
      <table class="details-table" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
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
              <tr><th style="text-align: left; padding: 8px; border: 1px solid #e0e0e0;">Paczkomat</th><td style="padding: 8px; border: 1px solid #e0e0e0;">${addressHomeParcel.parcelLocker?.name}</td></tr>
              <tr><th style="text-align: left; padding: 8px; border: 1px solid #e0e0e0;">Adres paczkomatu</th>
                <td style="padding: 8px; border: 1px solid #e0e0e0;">
                  ${addressHomeParcel.parcelLocker?.address.street || ""} ${addressHomeParcel.parcelLocker?.address.building_number || ""}<br />
                  ${addressHomeParcel.parcelLocker?.address.city || ""}, ${addressHomeParcel.parcelLocker?.address.post_code || ""}
                </td>
              </tr>
              `
              : ""
          }
        </tbody>
      </table>

      <h3>Produkty</h3>
      <table class="products-table" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
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
              (item) => `
              <tr>
                <td style="padding: 8px; border: 1px solid #e0e0e0;">${item.title}</td>
                <td style="padding: 8px; border: 1px solid #e0e0e0;">${item.quantity}</td>
                <td style="padding: 8px; border: 1px solid #e0e0e0;">${item.price} zł</td>
                <td style="padding: 8px; border: 1px solid #e0e0e0;">${(item.price * item.quantity).toFixed(2)} zł</td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>

      <p style="font-weight: bold; color: #333333;; text-align:right; padding-top:5px;">Koszt dostawy: ${deliveryCost.toFixed(2)} zł</p>
      <p style="font-weight: bold; color: #333333;; text-align:right; padding-bottom:20px">Razem do zapłaty: ${total.toFixed(2)} zł</p>

      <p class="color: #333333;"><strong>Twoje zamówienie jest przetwarzane.</strong><br />
        Otrzymasz od nas aktualne informacje dotyczące statusu zamówienia i dostawy paczki po opłaceniu zamówienia.
      </p>

      <h3>Wpłaty prosimy dokonać na:</h3>
      <p>
        <b>Europejska Fundacja ds. Szkolenia w Anestezjologii</b><br />
        62-021 Paczkowo<br />
        ul. Sokolnicka 56<br />
        <b>Nr konta bankowego:</b> 47 1140 2004 0000 3202 8319 5381
      </p>

      <p>Pozdrawiamy,<br />Zespół CEEA</p>

      <!-- Footer -->
      <div class="footer">
        <p>W razie pytań prosimy o kontakt pod adresem <a href="mailto:sekretariat@ceea.org.pl">sekretariat@ceea.org.pl</a>.</p>
        <p>© ${new Date().getFullYear()} CEEA Poznań. Wszelkie prawa zastrzeżone.</p>
      </div>

      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center">
            <img
              src="http://cdn.mcauto-images-production.sendgrid.net/6c0632f6ca434cdc/34940cd6-e123-4b4c-8124-8dfb4bbb5567/1070x151.png"
              alt="Footer Logo"
              style="width: 800px; height: auto; max-height: 150px; object-fit: contain;"
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

export default orderConfirmationUser
