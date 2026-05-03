const OrderConfirmation = ({
  firstName,
  lastName,
  orderNumber,
  deliveryMethod,
  items,
  deliveryCost,
  total,
}) => {
  const safeFirstName = firstName ?? ""
  const safeLastName = lastName ?? ""
  const safeOrderNumber = orderNumber ?? ""
  const safeDeliveryMethod = deliveryMethod ?? ""
  const safeTotal = total ?? 0
  const safeDeliveryCost = deliveryCost ?? 0
  const safeItems = Array.isArray(items) ? items : []

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
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background-color: #ffffff;
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
        margin-top: 20px;
        border-top: 1px solid #e0e0e0;
        padding-top: 10px;
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
      img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->

      <!-- Content -->
      <h1 style="color: #004aad; margin-bottom: 30px; margin-top: 20px; text-align:center">Zamówienie od: ${safeFirstName} ${safeLastName}!</h1>
      <p>Numer zamówienia: <strong>${safeOrderNumber}</strong></p>
      <p>Metoda dostawy: <strong>${safeDeliveryMethod}</strong></p>
      <p>Całkowita kwota: <strong>${safeTotal} zł</strong></p>

      <h2 style="color: #004aad; margin-top:50px;">Podsumowanie zamówienia</h2>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr>
            <th style="background: #004aad; color: #fff; text-align: left; padding: 10px; border: 1px solid #ddd;">Produkt</th>
            <th style="background: #004aad; color: #fff; text-align: left; padding: 10px; border: 1px solid #ddd;">Ilość</th>
            <th style="background: #004aad; color: #fff; text-align: left; padding: 10px; border: 1px solid #ddd;">Cena jedn.</th>
          </tr>
        </thead>
        <tbody>
        ${safeItems
          .filter(item => item)
          .map((item) => `
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">${item?.title ?? ""}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${item?.quantity ?? 0}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${item?.price ?? 0} zł</td>
            </tr>
          `)
          .join("")}
        </tbody>
      </table>

      <p style="text-align: right; font-weight: bold;">Koszt dostawy: ${safeDeliveryCost} zł</p>
      <p style="text-align: right; font-weight: bold;">Razem do zapłaty: ${safeTotal} zł</p>

      <!-- Footer -->
      <div class="footer">
        <p>© ${new Date().getFullYear()} CEEA Poznań. Wszelkie prawa zastrzeżone.</p>
      </div>
    </div>
  </body>
</html>
  `
  return rawHtml
}

export default OrderConfirmation
