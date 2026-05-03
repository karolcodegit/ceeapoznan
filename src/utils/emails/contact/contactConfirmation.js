const ContactConfirmation = ({
    name,
    email,
    message,
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
            .button {
              display: inline-block;
              padding: 10px 20px;
              font-size: 16px;
              font-weight: 600;
              color: white;
              background-color: #004aad;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
              text-align: center;
            }
            .button:hover {
              background-color: #003a8c;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            
            

            <!-- Content -->
            <div class="content">
              <h1>Nowa wiadomość od: ${name}!</h1>
              <p>Otrzymaliśmy nową wiadomość od użytkownika. Szczegóły poniżej:</p>

              <table class="details-table">
                <tr>
                  <th>Imię</th>
                  <td>${name}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>${email}</td>
                </tr>
                <tr>
                  <th>Wiadomość</th>
                  <td>${message}</td>
                </tr>
              </table>

              <p style="text-align: center;">
                <a href="mailto:${email}" class="button">Odpowiedz na wiadomość</a>
              </p>
            </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} CEEA Poznań. Wszelkie prawa zastrzeżone.</p>
      </div>
           
          </div>
        </body>
      </html>
    `
    return rawHtml
  }
export default ContactConfirmation