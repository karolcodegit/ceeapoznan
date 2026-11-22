"use strict";

const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  signDetachedJws,
  makeCertPair,
  notificationBody,
  mockFetchPemMap,
  clearCloudSrcCache,
} = require("./helpers");

const SANDBOX_X5U = "https://secure.sandbox.tpay.com/x509/notifications-jws.pem";
const SANDBOX_CA = "https://secure.sandbox.tpay.com/x509/tpay-jws-root.pem";
const PROD_X5U = "https://secure.tpay.com/x509/notifications-jws.pem";
const PROD_CA = "https://secure.tpay.com/x509/tpay-jws-root.pem";

let trusted;
let otherCa;

before(() => {
  trusted = makeCertPair("trusted");
  otherCa = makeCertPair("other");
});

after(() => {
  fs.rmSync(trusted.dir, { recursive: true, force: true });
  fs.rmSync(otherCa.dir, { recursive: true, force: true });
});

function loadTpay(mode) {
  process.env.TPAY_MODE = mode;
  clearCloudSrcCache();
  const mod = require("../src/tpay");
  mod.clearPemCache();
  return mod;
}

describe("Tpay detached JWS X.509 verification", () => {
  it("1. accepts a valid signed sandbox notification", async () => {
    const { verifyDetachedJws } = loadTpay("sandbox");
    const body = notificationBody("SBX-1");
    const jws = signDetachedJws(body, SANDBOX_X5U, trusted.leafKeyPem);
    const payload = await verifyDetachedJws(body, jws, {
      mode: "sandbox",
      fetchImpl: mockFetchPemMap({
        [SANDBOX_X5U]: trusted.leafPem,
        [SANDBOX_CA]: trusted.caPem,
      }),
    });
    assert.equal(payload.data.orderId, "SBX-1");
    assert.equal(payload.data.transactionStatus, "correct");
  });

  it("2. accepts a valid signed production notification", async () => {
    const { verifyDetachedJws } = loadTpay("production");
    const body = notificationBody("PROD-1");
    const jws = signDetachedJws(body, PROD_X5U, trusted.leafKeyPem);
    const payload = await verifyDetachedJws(body, jws, {
      mode: "production",
      fetchImpl: mockFetchPemMap({
        [PROD_X5U]: trusted.leafPem,
        [PROD_CA]: trusted.caPem,
      }),
    });
    assert.equal(payload.data.orderId, "PROD-1");
  });

  it("3. rejects a tampered body", async () => {
    const { verifyDetachedJws } = loadTpay("sandbox");
    const body = notificationBody("TAMPER-1");
    const jws = signDetachedJws(body, SANDBOX_X5U, trusted.leafKeyPem);
    const tampered = Buffer.from(body.toString("utf8") + " ");
    await assert.rejects(
      () =>
        verifyDetachedJws(tampered, jws, {
          mode: "sandbox",
          caPem: trusted.caPem,
          leafPem: trusted.leafPem,
        }),
      /JWS signature invalid/
    );
  });

  it("4. rejects missing or malformed signatures", async () => {
    const { verifyDetachedJws, verifyWebhook, base64UrlEncode } = loadTpay("sandbox");
    const body = notificationBody();

    await assert.rejects(
      () => verifyDetachedJws(body, undefined, { mode: "sandbox" }),
      /missing JWS/
    );
    await assert.rejects(
      () => verifyDetachedJws(body, "not.a.jws.extra", { mode: "sandbox" }),
      /invalid JWS/
    );
    await assert.rejects(
      () => verifyDetachedJws(body, "only-one-segment", { mode: "sandbox" }),
      /invalid JWS/
    );

    // Attached (non-detached) JWS rejected.
    const detached = signDetachedJws(body, SANDBOX_X5U, trusted.leafKeyPem);
    const attached = detached.replace("..", `.${base64UrlEncode(body)}.`);
    await assert.rejects(
      () =>
        verifyDetachedJws(body, attached, {
          mode: "sandbox",
          caPem: trusted.caPem,
          leafPem: trusted.leafPem,
        }),
      /detached/
    );

    // verifyWebhook maps crypto failures to null (no throw to caller).
    assert.equal(await verifyWebhook(body, null), null);
    assert.equal(await verifyWebhook(body, "bad"), null);
  });

  it("5. rejects untrusted or wrong-environment x5u/cert", async () => {
    const { verifyDetachedJws } = loadTpay("sandbox");
    const body = notificationBody();

    // Wrong environment: production x5u while mode is sandbox.
    const prodJws = signDetachedJws(body, PROD_X5U, trusted.leafKeyPem);
    await assert.rejects(
      () =>
        verifyDetachedJws(body, prodJws, {
          mode: "sandbox",
          caPem: trusted.caPem,
          leafPem: trusted.leafPem,
        }),
      /allowlisted|certificate URL/
    );

    // Untrusted host.
    const evilJws = signDetachedJws(body, "https://evil.example/cert.pem", trusted.leafKeyPem);
    await assert.rejects(
      () =>
        verifyDetachedJws(body, evilJws, {
          mode: "sandbox",
          caPem: trusted.caPem,
          leafPem: trusted.leafPem,
        }),
      /allowlisted|certificate URL/
    );

    // HTTP (not HTTPS) rejected.
    const httpJws = signDetachedJws(
      body,
      "http://secure.sandbox.tpay.com/x509/notifications-jws.pem",
      trusted.leafKeyPem
    );
    await assert.rejects(
      () =>
        verifyDetachedJws(body, httpJws, {
          mode: "sandbox",
          caPem: trusted.caPem,
          leafPem: trusted.leafPem,
        }),
      /HTTPS|certificate URL/
    );

    // Leaf not signed by the CA we trust (wrong CA material).
    const jws = signDetachedJws(body, SANDBOX_X5U, trusted.leafKeyPem);
    await assert.rejects(
      () =>
        verifyDetachedJws(body, jws, {
          mode: "sandbox",
          leafPem: trusted.leafPem,
          caPem: otherCa.caPem,
        }),
      /not signed by Tpay CA/
    );
  });

  it("9. duplicate TPAY_MODE already removed in cloud/.env", () => {
    const envPath = path.join(__dirname, "..", ".env");
    assert.ok(fs.existsSync(envPath), "cloud/.env should exist locally");
    const lines = fs
      .readFileSync(envPath, "utf8")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#") && l.startsWith("TPAY_MODE="));
    assert.equal(lines.length, 1, `expected one TPAY_MODE, found ${lines.length}`);
    const value = lines[0].split("=", 2)[1].trim().replace(/^["']|["']$/g, "");
    assert.equal(value, "sandbox");
  });
});
