// cloud/src/mailer.js — transport: Zoho ZeptoMail EU (primary) → MailerSend (fallback)
// Logo: JEDEN inline CID "ceea-logo" (ten sam co w panelu) – pobierane raz, cache'owane.
const ZEPTO_API_KEY = process.env.ZEPTOMAIL_API_KEY
const ZEPTO_FROM = process.env.ZEPTOMAIL_FROM_EMAIL || "sekretariat@ceea.org.pl"
const MAILERSEND_API_KEY = process.env.MAILERSEND_API_KEY
const FROM_EMAIL = process.env.MAIL_FROM_EMAIL || "sekretariat@ceea.org.pl"
const FROM_NAME = process.env.MAIL_FROM_NAME || "CEEA Poznań"
const LOGO_URL =
  process.env.LOGO_URL ||
  "https://panel.ceea.org.pl/images/logo-header-color-black.jpg"

let logoB64 = null
async function getLogoBase64() {
  if (logoB64) return logoB64
  try {
    const res = await fetch(LOGO_URL)
    if (!res.ok) return null
    logoB64 = Buffer.from(await res.arrayBuffer()).toString("base64")
  } catch {
    logoB64 = null // bez logo mail i tak się wyśle
  }
  return logoB64
}

async function sendViaZepto({ to, toName, subject, html, text, replyTo }) {
  if (!ZEPTO_API_KEY) throw new Error("Brak ZEPTOMAIL_API_KEY")
  const res = await fetch("https://cpaas.zoho.eu/v1.1/email", {
    method: "POST",
    headers: {
      Authorization: `Zoho-enczapikey ${ZEPTO_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      from: { address: ZEPTO_FROM, name: FROM_NAME },
      to: [{ email_address: { address: to, name: toName || to } }],
      reply_to: replyTo
        ? [{ email_address: { address: replyTo, name: replyTo } }]
        : [{ email_address: { address: ZEPTO_FROM, name: FROM_NAME } }],
      subject,
      htmlbody: html,
      textbody: text || "",
      ...(logoB64
        ? {
            inline_images: [
              { content: logoB64, cid: "ceea-logo", mime_type: "image/jpeg" },
            ],
          }
        : {}),
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`ZeptoMail ${res.status}: ${body}`)
  }
}

async function sendViaMailerSend({ to, toName, subject, html, text, replyTo }) {
  if (!MAILERSEND_API_KEY) throw new Error("Brak MAILERSEND_API_KEY")
  const res = await fetch("https://api.mailersend.com/v1/email", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MAILERSEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: { email: FROM_EMAIL, name: FROM_NAME },
      to: [{ email: to, name: toName || to }],
      reply_to: [{ email: replyTo || FROM_EMAIL }],
      subject,
      html,
      text,
      ...(logoB64
        ? {
            attachments: [
              {
                content: logoB64,
                filename: "logo.jpg",
                disposition: "inline",
                id: "ceea-logo",
              },
            ],
          }
        : {}),
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`MailerSend ${res.status}: ${body}`)
  }
}

async function sendMail(payload) {
  await getLogoBase64()
  try {
    return await sendViaZepto(payload)
  } catch (e) {
    console.warn(
      `⚠️ ZeptoMail nie powiódł się (${e.message}) – fallback do MailerSend`
    )
    return await sendViaMailerSend(payload)
  }
}

module.exports = { sendMail, sendViaZepto, sendViaMailerSend }
