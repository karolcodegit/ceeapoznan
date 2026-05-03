import React from "react"

const ContactConfirmationUser = ({title_book}) => {
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
        background-color:#f7f7f7
        color: #000000;
        line-height: 1.6;
      }
      .container {
        max-width: 600px;
        margin: 100px auto;
        padding: 5px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background-color: #ffffff;
      }
        .content{
          padding:60px 20px;
        }
      h1 {
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
        p.bold {
        font-weight: 600;
        }
      a {
        color: #1155cc;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
      .footer {
        font-size: 10px;
        color: #555555;
        text-align: center;
        margin-top: 10px;
        border-top: 1px solid #e0e0e0;
        padding-top: 10px 20px;
      }
        .footer p{
          font-size: 10px;
          text-align: center;

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
        src="https://drive.usercontent.google.com/download?id=17jx9fPsPNtbxQbrRED44b0KHw--mf0W2&export=view&authuser=0" 
        alt="CEEA - Header" 
        width="100%" 
        style="max-width: 100%; height: auto; display: block;" 
      />
    </td>
  </tr>
</table>

      <!-- Content -->
      <div class="content">
        <p class='bold'>
          Szanowna Pani/Szanowny Panie,
        </p>
        <p>
          Dziękujemy za zainteresowanie naszą ofertą i chęć zakupu książki
            "${title_book}".
            Z przykrością informujemy, że produkt, który chciał(a) Pan/Pani zamówić, jest obecnie niedostępny w naszej ofercie
        </p>
        <p>
          Jednakże, nie martw się! Gdy książka będzie ponownie dostępna, skontaktujemy się z Panem/Panią, aby powiadomić o jej dostępności i umożliwić złożenie zamówienia.
        </p>
        <p>
            Chcielibyśmy również zapewnić, że staramy się jak najszybciej uzupełnić nasze stany magazynowe. Prosimy o cierpliwość i zapraszamy do zapoznania się z naszą pełną ofertą, gdzie znajdziesz inne interesujące produkty. 
        </p>
        <p>
            Dziękujemy za zrozumienie i cierpliwość. 
        </p>
        <p>
          Z poważaniem,<br />
          Ośrodek CEEA Poznań
        </p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>© ${new Date().getFullYear()} CEEA. Wszelkie prawa zastrzeżone.</p>
      </div>

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td align="center">
      <img 
        src="https://drive.usercontent.google.com/download?id=1fqyN0A7X0AUOhN24pWEX0O-S_OfTWxWm&export=view&authuser=0" 
        alt="CEEA - Footer" 
        width="100%" 
        style="max-width: 100%; height: auto; display: block;" 
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
