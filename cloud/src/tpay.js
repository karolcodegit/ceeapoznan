// cloud/src/tpay.js – REST API tpay + TRYB TESTOWY (bez aktywnego konta)
// TPAY_MODE: "test" | "sandbox" | "production"
//   test       – bramka zaślepiona, pełny przepływ do przetestowania bez tpay
//   sandbox    – środowisko testowe tpay (TPAY_API_URL = https://api.sandbox.tpay.com)
//   production – produkcja (JWS + prawdziwe API)
const { createRemoteJWKSet, jwtVerify } = require("jose");

const MODE = process.env.TPAY_MODE || "test";
const API_URL = process.env.TPAY_API_URL || "https://api.tpay.com";

let cachedToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) return cachedToken;
  const credentials = Buffer.from(
    `${process.env.TPAY_CLIENT_ID}:${process.env.TPAY_CLIENT_SECRET}`
  ).toString("base64");
  const res = await fetch(`${API_URL}/oauth/auth`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`tpay OAuth ${res.status}: ${await res.text()}`);
  const json = await res.json();
  cachedToken = json.access_token;
  tokenExpiresAt = Date.now() + (json.expires_in || 3600) * 1000;
  return cachedToken;
}

async function createTransaction({ amount, description, payer, orderNumber }) {
  // ── TRYB TESTOWY: bramka zaślepiona ──
  if (MODE === "test") {
    const txId = `TEST-${orderNumber}`;
    console.log(`🧪 [TEST] Utworzono transakcję ${txId}, kwota ${amount} zł`);
    return {
      transactionId: txId,
      transactionUrl: `${process.env.FRONTEND_URL}/platnosc-test?order=${orderNumber}`,
    };
  }

  // ── sandbox / production: prawdziwe API ──
  const token = await getAccessToken();
  const res = await fetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      amount,
      currency: "PLN",
      description,
      payer,
      lang: "pl",
      orderId: orderNumber,
      notification_url: process.env.TPAY_NOTIFICATION_URL,
      result_url: process.env.TPAY_RESULT_URL,
    }),
  });
  if (!res.ok) throw new Error(`tpay transaction ${res.status}: ${await res.text()}`);
  return res.json();
}

// Weryfikacja webhooka. W trybie testowym wymagany nagłówek x-test-key
// (sprawdzany w webhook.js), tu tylko parsujemy JSON.
const JWKS = process.env.TPAY_JWKS_URL
  ? createRemoteJWKSet(new URL(process.env.TPAY_JWKS_URL))
  : null;

async function verifyWebhook(rawBody, signatureHeader) {
  if (MODE === "test") {
    try {
      return JSON.parse(rawBody.toString());
    } catch {
      return null;
    }
  }
  try {
    if (!signatureHeader || !JWKS) return null;
    const { payload } = await jwtVerify(signatureHeader, JWKS);
    return payload;
  } catch (e) {
    console.error("JWS verification failed:", e.message);
    return null;
  }
}

module.exports = { createTransaction, verifyWebhook, MODE };
