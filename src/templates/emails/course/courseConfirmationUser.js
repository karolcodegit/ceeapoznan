const CourseConfirmationUser = ({ courseTitle, total, orderNumber }) => {
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
            font-size: 20px;
            font-weight: 700;
            color: #333333;
            margin-bottom: 20px;
            margin-top: 50px;
            text-align: left;
          }
          p {
            font-size: 16px;
            color: #555555;
            margin: 0 0 35px;
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

          <!-- Header -->
          <h1>Szanowna Uczestniczko, Szanowny Uczestniku,</h1>

          <!-- Content -->
          <p>
            Serdecznie dziękujemy za zainteresowanie naszym kursem. Niniejszym potwierdzamy przyjęcie zgłoszenia chęci udziału w kursie 
            <b>"${courseTitle}"</b>.
          </p>

          <p>
            Przypominamy o konieczności opłacenia uczestnictwa w kursie. Kwota do zapłaty wynosi 
            <b>${total} zł</b>. Wpłaty prosimy dokonywać na konto:
          </p>

          <p>
            <strong>Europejska Fundacja ds. Szkolenia w Anestezjologii</strong><br />
            62-021 Paczkowo,<br />
            ul. Sokolnicka 56<br />
            <strong>Nr konta bankowego:</strong> 47 1140 2004 0000 3202 8319 5381
          </p>

          <p>
            W tytule przelewu prosimy o podanie <b>imienia i nazwiska</b> oraz numer zamówienia <b>${orderNumber} </b>.
          </p>

          <p>
            Potwierdzenie uczestnictwa wraz z fakturą zostaną wysłane na koniec miesiąca, w którym nastąpiło opłacenie udziału w kursie. Prosimy o cierpliwe oczekiwanie na wiadomość zwrotną drogą mailową.
          </p>

          <p>
            Mamy nadzieję, że spełnimy Państwa oczekiwania w związku z udziałem w kursie. W przypadku pytań i wątpliwości pozostajemy do Państwa dyspozycji.
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
export default CourseConfirmationUser
