// cloud/src/tpay.js – REST API tpay + TRYB TESTOWY (bez aktywnego konta)
// TPAY_MODE: "test" | "sandbox" | "production"
//   test       – bramka zaślepiona, pełny przepływ do przetestowania bez tpay
//   sandbox    – środowisko testowe tpay (OpenAPI sandbox host via TPAY_API_URL)
//   production – produkcja (JWS X.509 + prawdziwe API)
//
// Webhook verification (sandbox/production): detached JWS + x5u X.509 + Tpay CA
// per https://docs-api.tpay.com/en/webhooks/ — not JWKS.
const crypto = require("crypto");
const { X509Certificate } = crypto;

// No implicit test mode: unset/unknown configuration disables payment creation
// and webhook processing until an operator selects an explicit mode.
const MODE = process.env.TPAY_MODE || "disabled";
const API_URL = process.env.TPAY_API_URL || "https://api.tpay.com";

const JWS_TRUST = {
  sandbox: {
    x5uPrefixes: ["https://secure.sandbox.tpay.com/"],
    caUrl: "https://secure.sandbox.tpay.com/x509/tpay-jws-root.pem",
  },
  production: {
    x5uPrefixes: ["https://secure.tpay.com/"],
    caUrl: "https://secure.tpay.com/x509/tpay-jws-root.pem",
  },
};

const PEM_MAX_BYTES = 64 * 1024;
const PEM_FETCH_TIMEOUT_MS = 5_000;
const CERT_CACHE_TTL_MS = 60 * 60 * 1000;

let cachedToken = null;
let tokenExpiresAt = 0;
const pemCache = new Map(); // url -> { pem, expiresAt }

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
    if (process.env.NODE_ENV === "production") {
      throw new Error("TPAY_MODE=test is disabled in production");
    }
    const txId = `TEST-${orderNumber}`;
    console.log(`🧪 [TEST] Utworzono transakcję ${txId}, kwota ${amount} zł`);
    return {
      transactionId: txId,
      transactionUrl: `${process.env.FRONTEND_URL}/platnosc-test?order=${orderNumber}`,
    };
  }

  if (MODE !== "sandbox" && MODE !== "production") {
    throw new Error("TPAY_MODE must be explicitly set to test, sandbox, or production");
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

function base64UrlEncode(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str) {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((str.length + 3) % 4);
  return Buffer.from(padded, "base64");
}

function assertHttpsAllowlistedUrl(urlString, allowedPrefixes) {
  let url;
  try {
    url = new URL(urlString);
  } catch {
    throw new Error("invalid certificate URL");
  }
  if (url.protocol !== "https:") throw new Error("certificate URL must be HTTPS");
  if (url.username || url.password) throw new Error("certificate URL must not include credentials");
  if (url.hostname === "localhost" || url.hostname.endsWith(".local")) {
    throw new Error("certificate URL host not allowed");
  }
  const normalized = url.href;
  const ok = allowedPrefixes.some(
    (prefix) => normalized === prefix || normalized.startsWith(prefix)
  );
  if (!ok) throw new Error("certificate URL host not allowlisted");
  return url;
}

async function fetchPem(urlString, allowedPrefixes, fetchImpl = fetch) {
  const cached = pemCache.get(urlString);
  if (cached && cached.expiresAt > Date.now()) return cached.pem;

  const url = assertHttpsAllowlistedUrl(urlString, allowedPrefixes);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PEM_FETCH_TIMEOUT_MS);
  try {
    const res = await fetchImpl(url.href, {
      method: "GET",
      redirect: "error",
      signal: controller.signal,
      headers: { Accept: "application/x-x509-ca-cert,application/pem-certificate-chain,*/*" },
    });
    if (!res.ok) throw new Error(`certificate fetch HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length === 0 || buf.length > PEM_MAX_BYTES) {
      throw new Error("certificate payload size out of bounds");
    }
    const pem = buf.toString("utf8");
    if (!/-----BEGIN CERTIFICATE-----/.test(pem)) {
      throw new Error("certificate payload is not PEM");
    }
    pemCache.set(urlString, { pem, expiresAt: Date.now() + CERT_CACHE_TTL_MS });
    return pem;
  } finally {
    clearTimeout(timer);
  }
}

function leafIssuedByCa(leafPem, caPem) {
  const leaf = new X509Certificate(leafPem);
  const ca = new X509Certificate(caPem);
  // Cryptographic check: leaf must be signed by the CA public key.
  return leaf.verify(ca.publicKey);
}

/**
 * Verify Tpay detached JWS (X-JWS-Signature) over exact rawBody bytes.
 * @param {Buffer|string} rawBody
 * @param {string} signatureHeader compact JWS (header..signature)
 * @param {object} [options] test hooks: { mode, fetchImpl, caPem, leafPem }
 */
async function verifyDetachedJws(rawBody, signatureHeader, options = {}) {
  const mode = options.mode || MODE;
  const trust = JWS_TRUST[mode];
  if (!trust) throw new Error(`JWS trust not configured for mode ${mode}`);
  if (!signatureHeader || typeof signatureHeader !== "string") {
    throw new Error("missing JWS signature header");
  }

  const parts = signatureHeader.split(".");
  if (parts.length !== 3) throw new Error("invalid JWS compact serialization");
  const [protectedB64, payloadB64, signatureB64] = parts;
  // Tpay notifications use detached JWS (empty payload segment).
  if (payloadB64 !== "") throw new Error("expected detached JWS (empty payload)");

  let header;
  try {
    header = JSON.parse(base64UrlDecode(protectedB64).toString("utf8"));
  } catch {
    throw new Error("invalid JWS header JSON");
  }
  if (header.alg && header.alg !== "RS256") {
    throw new Error(`unsupported JWS alg ${header.alg}`);
  }
  if (!header.x5u || typeof header.x5u !== "string") {
    throw new Error("missing x5u in JWS header");
  }

  // Always enforce x5u allowlist (even when leafPem is injected for tests).
  assertHttpsAllowlistedUrl(header.x5u, trust.x5uPrefixes);

  const fetchImpl = options.fetchImpl || fetch;
  const leafPem =
    options.leafPem ||
    (await fetchPem(header.x5u, trust.x5uPrefixes, fetchImpl));
  // CA URL must also stay on the same allowlisted Tpay host prefix.
  const caPem =
    options.caPem ||
    (await fetchPem(trust.caUrl, trust.x5uPrefixes, fetchImpl));

  if (!leafIssuedByCa(leafPem, caPem)) {
    throw new Error("leaf certificate not signed by Tpay CA");
  }

  const bodyBuf = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody ?? "");
  const signingInput = Buffer.from(`${protectedB64}.${base64UrlEncode(bodyBuf)}`);
  const signature = base64UrlDecode(signatureB64);
  const publicKey = crypto.createPublicKey(leafPem);
  const ok = crypto.verify("RSA-SHA256", signingInput, publicKey, signature);
  if (!ok) throw new Error("JWS signature invalid");

  return JSON.parse(bodyBuf.toString("utf8"));
}

// Weryfikacja webhooka. W trybie testowym wymagany nagłówek x-test-key
// (sprawdzany w webhook.js), tu tylko parsujemy JSON.
async function verifyWebhook(rawBody, signatureHeader, options = {}) {
  if (MODE === "test") {
    try {
      return JSON.parse(Buffer.isBuffer(rawBody) ? rawBody.toString("utf8") : String(rawBody));
    } catch {
      return null;
    }
  }
  if (MODE !== "sandbox" && MODE !== "production") {
    return null;
  }
  try {
    return await verifyDetachedJws(rawBody, signatureHeader, options);
  } catch (e) {
    console.error("JWS verification failed:", e.message);
    return null;
  }
}

function clearPemCache() {
  pemCache.clear();
}

module.exports = {
  createTransaction,
  verifyWebhook,
  MODE,
  // test-only helpers
  verifyDetachedJws,
  clearPemCache,
  JWS_TRUST,
  base64UrlEncode,
};
