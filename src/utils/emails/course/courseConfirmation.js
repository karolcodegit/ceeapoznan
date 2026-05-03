const CourseConfirmation = ({
  firstName,
  surName,
  email,
  phone,
  birthday,
  courseTitle,
  street,
  numberHome,
  zipCode,
  city,
  invoiceName,
  invoiceStreet,
  invoiceNumberHome,
  invoiceZipCode,
  invoiceCity,
  invoiceNip,
  dishes,
  total,
  orderNumber,
}) => {
  const rawHtml = `
    <!DOCTYPE html>
<html lang="pl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, Helvetica, sans-serif;
        background-color: #f7f7f7;
        color: #000000;
        line-height: 1.6;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background-color: #ffffff;
      }
      h1, h2, h3 {
        font-size: 20px;
        font-weight: 700;
        color: #000000;
        margin-bottom: 20px;
        text-align: left;
      }
      p {
        font-size: 16px;
        color: #000000;
        margin: 0 0 20px;
        text-align: left;
      }
      a {
        color: #1155cc;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
      .footer {
        font-size: 14px;
        color: #555555;
        text-align: center;
        margin-top: 100px;
        border-top: 1px solid #e0e0e0;
        padding-top: 10px;
      }
      .details-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      .details-table th, .details-table td {
        padding: 10px;
        border: 1px solid #e0e0e0;
        text-align: left;
      }
      .details-table th {
        background-color: #f4f4f4;
        font-weight: bold;
      }
      .total-price {
        font-size: 18px;
        font-weight: bold;
        text-align: right;
        margin-top: 10px;
      }
        .footer {
        font-size: 10px;
        color: #555555;
        text-align: center;
        margin-top: 100px;
        border-top: 1px solid #e0e0e0;
       padding-top:10px;
      }
         .footer p{
          font-size: 10px;
          text-align: center;

        }

    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <h1>Nowa rejestracja użytkownika</h1>
      <p>Otrzymaliśmy nową rejestrację użytkownika. Poniżej znajdują się szczegóły:</p>

      <!-- Dane użytkownika -->
      <h3>Dane użytkownika</h3>
      <table class="details-table">
        <tbody>
          <tr><th>Numer zamówienia</th><td>${orderNumber}</td></tr>
          <tr><th>Imię</th><td>${firstName}</td></tr>
          <tr><th>Nazwisko</th><td>${surName}</td></tr>
          <tr><th>Email</th><td>${email}</td></tr>
          <tr><th>Telefon</th><td>${phone}</td></tr>
          <tr><th>Data urodzenia</th><td>${birthday}</td></tr>
        </tbody>
      </table>

      <!-- Szczegóły kursu -->
      <h3>Szczegóły kursu</h3>
      <table class="details-table">
        <tbody>
          <tr><th>Tytuł kursu</th><td>${courseTitle}</td></tr>
          <tr><th>Koszt kursu</th><td>${total} zł</td></tr>
        </tbody>
      </table>

      <!-- Adres -->
      <h3>Adres</h3>
      <table class="details-table">
        <tbody>
          <tr><th>Ulica</th><td>${street} ${numberHome}</td></tr>
          <tr><th>Kod pocztowy</th><td>${zipCode}</td></tr>
          <tr><th>Miasto</th><td>${city}</td></tr>
        </tbody>
      </table>

      <!-- Faktura -->
      <h3>Dane do faktury</h3>
${
  !invoiceName &&
  !invoiceStreet &&
  !invoiceNumberHome &&
  !invoiceZipCode &&
  !invoiceCity &&
  !invoiceNip
    ? `<p>Brak faktury</p>`
    : `
  <table class="details-table">
    <tbody>
      <tr><th>Nazwa</th><td>${invoiceName || "Brak"}</td></tr>
      <tr><th>Ulica</th><td>${invoiceStreet || "Brak"} ${
        invoiceNumberHome || ""
      }</td></tr>
      <tr><th>Kod pocztowy</th><td>${invoiceZipCode || "Brak"}</td></tr>
      <tr><th>Miasto</th><td>${invoiceCity || "Brak"}</td></tr>
      <tr><th>NIP</th><td>${invoiceNip || "Brak"}</td></tr>
    </tbody>
  </table>
`
}

      <!-- Dodatkowe informacje -->
      <h3>Dodatkowe informacje</h3>
      <p>Wybrane dania: ${dishes}</p>
      
      
      <!-- Stopka -->
      <div class="footer">
        <p>© ${new Date().getFullYear()} CEEA Poznań. Wszelkie prawa zastrzeżone.</p>
      </div>
    </div>
  </body>
</html>
    `
  return rawHtml
}
export default CourseConfirmation
