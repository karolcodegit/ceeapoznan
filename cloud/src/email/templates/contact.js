// cloud/src/email/templates/contact.js — potwierdzenie formularza kontaktowego
const { renderEmail, infoBox, button, esc } = require("../layout")

const confirmation = ({ name, message }) => ({
  subject: "Potwierdzenie wiadomości – CEEA Poznań",
  html: renderEmail({
    preheader: "Otrzymaliśmy Twoją wiadomość",
    title: name ? `Dzień dobry ${esc(name)},` : "Dzień dobry,",
    content: `
      <p>Dziękujemy za skontaktowanie się z nami. Potwierdzamy otrzymanie Twojej
         wiadomości i dołożymy wszelkich starań, aby odpowiedzieć możliwie jak
         najszybciej – zazwyczaj w ciągu 1–2 dni roboczych.</p>
      ${infoBox(
        `<p style="margin:0;font-size:14px"><strong>Twoja wiadomość:</strong><br>${esc(
          cleanMessage(message)
        ).replace(/\n/g, "<br>")}</p>`
      )}
      
      <p style="margin-top:24px">Pozdrawiamy,<br /><strong>Zespół CEEA Poznań</strong></p>`,
  }).html,
  text: `Dzień dobry,

Dziękujemy za skontaktowanie się z nami. Potwierdzamy otrzymanie Twojej wiadomości
i dołożymy wszelkich starań, aby odpowiedzieć możliwie jak najszybciej –
zazwyczaj w ciągu 1–2 dni roboczych.

Twoja wiadomość:
${cleanMessage(message)}

Pozdrawiamy,
Zespół CEEA Poznań`,
});

const organizer = ({ name, email, message }) => ({
  subject: `✉️ Formularz kontaktowy: ${name || email}`,
  html: renderEmail({
    preheader: `Wiadomość od ${name || email}`,
    title: "Nowa wiadomość ze strony",
    content: `
      <p>Imię: <strong>${esc(name || "—")}</strong><br>
      E-mail: <a href="mailto:${esc(email)}">${esc(email)}</a></p>
      ${infoBox(`<p style="margin:0;font-size:14px"><strong>Wiadomość:</strong><br>${esc(String(message || "").slice(0, 2000)).replace(/\n/g, "<br>")}</p>`)}
      ${button("Odpowiedz: " + (name || email), `mailto:${email}?subject=${encodeURIComponent("Odp.: Formularz kontaktowy")}&body=${encodeURIComponent("\n\n— oryginalna wiadomość —\n" + String(message || ""))}`)}
      <p style="font-size:12px;color:#9ca3af">Przycisk otworzy wiadomość bezpośrednio do nadawcy.</p>`,
  }).html,
  text: `Wiadomość od: ${name || "—"} <${email}>\n\n${message}\n\n(Odpisz bezpośrednio na ten adres: ${email})`,
});

// przycięcie spacji + zwinięcie pustych linii (cytat nie rozjeżdża infoBoksa)
function cleanMessage(m) {
  return String(m || "")
    .trim()
    .replace(/\n{3,}/g, "\n\n")
    .slice(0, 500)
}

module.exports = { confirmation, organizer }
