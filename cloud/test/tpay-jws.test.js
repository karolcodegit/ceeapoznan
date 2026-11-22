"use strict";

const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "tpay-jws-"));
const caKey = path.join(tmp, "ca.key");
const caPemPath = path.join(tmp, "ca.pem");
const leafKey = path.join(tmp, "leaf.key");
const leafCsr = path.join(tmp, "leaf.csr");
const leafPemPath = path.join(tmp, "leaf.pem");

function openssl(args) {
  execFileSync("openssl", args, { stdio: ["ignore", "pipe", "pipe"] });
}

before(() => {
  openssl([
    "req", "-x509", "-newkey", "rsa:2048", "-keyout", caKey, "-out", caPemPath,
    "-days", "1", "-nodes", "-subj", "/CN=CEEA Test Tpay CA",
  ]);
  openssl([
    "req", "-newkey", "rsa:2048", "-keyout", leafKey, "-out", leafCsr,
    "-nodes", "-subj", "/CN=CEEA Test Tpay Leaf",
  ]);
  openssl([
    "x509", "-req", "-in", leafCsr, "-CA", caPemPath, "-CAkey", caKey,
    "-CAcreateserial", "-out", leafPemPath, "-days", "1",
  ]);
});

after(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
});

function b64url(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function signDetachedJws(rawBody, x5u, privateKeyPem) {
  const header = { alg: "RS256", x5u };
  const protectedB64 = b64url(Buffer.from(JSON.stringify(header)));
  const signingInput = Buffer.from(`${protectedB64}.${b64url(rawBody)}`);
  const signature = crypto.sign("RSA-SHA256", signingInput, privateKeyPem);
  return `${protectedB64}..${b64url(signature)}`;
}

describe("Tpay detached JWS X.509 verification", () => {
  it("accepts a valid detached JWS over exact raw body", async () => {
    // Load module after env is set for MODE used only in verifyWebhook wrapper.
    process.env.TPAY_MODE = "sandbox";
    delete require.cache[require.resolve("../src/tpay")];
    const {
      verifyDetachedJws,
      clearPemCache,
      base64UrlEncode,
    } = require("../src/tpay");
    clearPemCache();

    const caPem = fs.readFileSync(caPemPath, "utf8");
    const leafPem = fs.readFileSync(leafPemPath, "utf8");
    const leafKeyPem = fs.readFileSync(leafKey, "utf8");
    const x5u = "https://secure.sandbox.tpay.com/x509/notifications-jws.pem";
    const body = Buffer.from(
      JSON.stringify({
        data: {
          orderId: "ORD-1",
          transactionStatus: "correct",
          transactionAmount: 10,
          transactionPaidAmount: 10,
          transactionCurrency: "PLN",
        },
      })
    );
    const jws = signDetachedJws(body, x5u, leafKeyPem);

    const fetched = new Set();
    const fetchImpl = async (url) => {
      fetched.add(url);
      let pem;
      if (url === x5u) pem = leafPem;
      else if (url === "https://secure.sandbox.tpay.com/x509/tpay-jws-root.pem") pem = caPem;
      else throw new Error(`unexpected fetch ${url}`);
      return {
        ok: true,
        status: 200,
        arrayBuffer: async () => Buffer.from(pem, "utf8"),
      };
    };

    const payload = await verifyDetachedJws(body, jws, {
      mode: "sandbox",
      fetchImpl,
    });
    assert.equal(payload.data.orderId, "ORD-1");
    assert.ok(fetched.has(x5u));
    assert.ok(fetched.has("https://secure.sandbox.tpay.com/x509/tpay-jws-root.pem"));

    // Tampered body must fail.
    await assert.rejects(
      () =>
        verifyDetachedJws(Buffer.from(body.toString("utf8") + " "), jws, {
          mode: "sandbox",
          fetchImpl,
          caPem,
          leafPem,
        }),
      /JWS signature invalid|JSON/
    );

    // Non-allowlisted x5u must fail.
    const badJws = signDetachedJws(body, "https://evil.example/cert.pem", leafKeyPem);
    await assert.rejects(
      () =>
        verifyDetachedJws(body, badJws, {
          mode: "sandbox",
          fetchImpl: async () => {
            throw new Error("should not fetch");
          },
          caPem,
        }),
      /allowlisted|HTTPS|certificate URL/
    );

    // Attached (non-detached) JWS rejected.
    const attached = jws.replace("..", `.${base64UrlEncode(body)}.`);
    await assert.rejects(
      () =>
        verifyDetachedJws(body, attached, {
          mode: "sandbox",
          caPem,
          leafPem,
        }),
      /detached/
    );
  });

  it("verifyWebhook returns null on crypto failure (sandbox)", async () => {
    process.env.TPAY_MODE = "sandbox";
    delete require.cache[require.resolve("../src/tpay")];
    const { verifyWebhook, clearPemCache } = require("../src/tpay");
    clearPemCache();
    const out = await verifyWebhook(Buffer.from("{}"), "not-a-jws");
    assert.equal(out, null);
  });

  it("verifyWebhook test mode still parses unsigned JSON", async () => {
    process.env.TPAY_MODE = "test";
    delete require.cache[require.resolve("../src/tpay")];
    const { verifyWebhook } = require("../src/tpay");
    const out = await verifyWebhook(Buffer.from('{"ok":true}'), undefined);
    assert.deepEqual(out, { ok: true });
  });
});
