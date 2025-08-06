const ContactConfirmationUser = () => {
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
        font-family: 'Aptos', Arial, Helvetica, sans-serif;
        background-color: #f7f7f7;
        color: #000000;
        line-height: 1.6;
      }
      .container {
        max-width: 600px;
        margin: 50px auto;
        padding: 20px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background-color: #ffffff;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .content {
        padding: 40px 20px;
      }
      h1 {
        font-size: 22px;
        font-weight: 700;
        color: #333333;
        margin-bottom: 20px;
        text-align: left;
      }
      p {
        font-size: 16px;
        color: #555555;
        margin: 0 0 35px;
        text-align: left;
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
        font-size: 10px;
        color: #555555;
        text-align: center;
        margin-top: 50px;
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
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center">
            <img
              src="http://cdn.mcauto-images-production.sendgrid.net/6c0632f6ca434cdc/aed2177f-9a2d-45d8-b0ef-0044f3e031aa/2140x296.png"
              alt="CEEA Poznań - header"
                  style="width: 800px; height: auto; margin-bottom: 20px; max-height: 150px; object-fit: contain;"
            />
          </td>
        </tr>
      </table>

      <!-- Content -->
      <div class="content">
        <p class="bold">
          Szanowna Pani/Szanowny Panie,
        </p>
        <p>
          Dziękujemy za skontaktowanie się z nami i potwierdzamy odbiór wiadomości. 
          Dołożymy wszelkich starań, aby odpowiedzieć na nią możliwie jak najszybciej.
        </p>
        <p>
          W sprawach pilnych prosimy o kontakt za pośrednictwem numerów telefonów 
          zamieszczonych na naszej stronie internetowej 
          <a href="https://www.ceea.org.pl" target="_blank">www.ceea.org.pl</a>.
        </p>
        <p>Pozdrawiamy,<br />Zespół CEEA</p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>© ${new Date().getFullYear()} CEEA Poznań. Wszelkie prawa zastrzeżone.</p>
      </div>

      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center">
            <img
              src="http://cdn.mcauto-images-production.sendgrid.net/6c0632f6ca434cdc/34940cd6-e123-4b4c-8124-8dfb4bbb5567/1070x151.png"
              alt="CEEA Poznań - footer"
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

export default ContactConfirmationUser
