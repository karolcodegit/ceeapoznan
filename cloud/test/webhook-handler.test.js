"use strict";

const { describe, it, before, after, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const {
  signDetachedJws,
  makeCertPair,
  notificationBody,
  mockFetchPemMap,
  mockRes,
  clearCloudSrcCache,
  stubModule,
} = require("./helpers");

const SANDBOX_X5U = "https://secure.sandbox.tpay.com/x509/notifications-jws.pem";
const SANDBOX_CA = "https://secure.sandbox.tpay.com/x509/tpay-jws-root.pem";

let trusted;
const savedEnv = {};

before(() => {
  trusted = makeCertPair("webhook");
});

after(() => {
  fs.rmSync(trusted.dir, { recursive: true, force: true });
});

beforeEach(() => {
  for (const key of [
    "TPAY_MODE",
    "ALLOW_PAYMENT_SIMULATION",
    "NODE_ENV",
    "ADMIN_KEY",
  ]) {
    savedEnv[key] = process.env[key];
  }
});

afterEach(() => {
  for (const [key, value] of Object.entries(savedEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  clearCloudSrcCache();
});

function stubCommonDeps({ paymentUpdates }) {
  stubModule("supabase", {
    from(table) {
      return {
        select() {
          return this;
        },
        eq() {
          return this;
        },
        async maybeSingle() {
          // No matching payment/order — if applyPaymentStatus runs after a
          // failed verify we still must not see updates; if it runs with a
          // valid payload and no row, handler returns 404 without updating.
          return { data: null };
        },
        update(payload) {
          paymentUpdates.push({ table, payload });
          return {
            eq() {
              return this;
            },
            async select() {
              return { data: [] };
            },
          };
        },
      };
    },
    rpc: async () => ({ data: null }),
  });
  stubModule("mailer", { sendMail: async () => {} });
  stubModule("email/templates", {
    paymentSuccess: () => ({}),
  });
  stubModule("notify", { notify: async () => {} });
  stubModule("pricing", {
    expectedCourseAmount: () => null,
    expectedBookAmount: () => null,
    providerPaymentMatches: () => true,
  });
  stubModule("adminAuth", {
    requireAdminKey(req, res, headerName = "x-admin-key") {
      const expected = process.env.ADMIN_KEY;
      if (!expected) {
        res.status(503).json({ error: "Admin authorization is not configured" });
        return false;
      }
      if (req.headers[headerName] !== expected) {
        res.status(401).json({ error: "Unauthorized" });
        return false;
      }
      return true;
    },
  });
}

/**
 * Load webhook with real tpay module (MODE from env) and stubbed I/O deps.
 * Optionally wrap verifyWebhook to inject cert fetch stubs via options — we
 * instead stub global fetch for PEM URLs when needed.
 */
function loadWebhookHandler(mode) {
  process.env.TPAY_MODE = mode;
  clearCloudSrcCache();
  const paymentUpdates = [];
  stubCommonDeps({ paymentUpdates });
  // Load real tpay after stubs so webhook gets real verifyWebhook + MODE.
  const tpay = require("../src/tpay");
  tpay.clearPemCache();
  const webhook = require("../src/webhook");
  return { webhook, tpay, paymentUpdates };
}

describe("webhookHandler security gates", () => {
  it("6. failed verification cannot update payment status", async () => {
    const { webhook, paymentUpdates } = loadWebhookHandler("sandbox");
    const res = mockRes();
    const body = notificationBody("FAIL-1");
    await webhook.webhookHandler(
      {
        method: "POST",
        rawBody: body,
        headers: { "x-jws-signature": "not-a-valid-jws" },
      },
      res
    );
    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { result: "FAIL" });
    assert.equal(paymentUpdates.length, 0);
  });

  it("7. sandbox mode reaches verification rather than 503", async () => {
    const { webhook, paymentUpdates } = loadWebhookHandler("sandbox");

    // Missing signature → verify path → 401 (not 503 mode gate).
    const resMissing = mockRes();
    await webhook.webhookHandler(
      { method: "POST", rawBody: Buffer.from("{}"), headers: {} },
      resMissing
    );
    assert.equal(resMissing.statusCode, 401);
    assert.notEqual(resMissing.statusCode, 503);

    // Valid synthetic sandbox notification → verify succeeds; no DB row → 404
    // (proves we passed mode gate and crypto, then business lookup).
    const body = notificationBody("SBX-OK");
    const jws = signDetachedJws(body, SANDBOX_X5U, trusted.leafKeyPem);
    const prevFetch = global.fetch;
    global.fetch = mockFetchPemMap({
      [SANDBOX_X5U]: trusted.leafPem,
      [SANDBOX_CA]: trusted.caPem,
    });
    try {
      const resOk = mockRes();
      await webhook.webhookHandler(
        {
          method: "POST",
          rawBody: body,
          headers: { "x-jws-signature": jws },
        },
        resOk
      );
      assert.equal(resOk.statusCode, 404);
      assert.deepEqual(resOk.body, { result: "FAIL" });
      assert.equal(paymentUpdates.length, 0);
    } finally {
      global.fetch = prevFetch;
    }
  });

  it("8. test simulation inaccessible unless all existing gates satisfied", async () => {
    // --- webhookHandler test mode ---
    process.env.ADMIN_KEY = "test-admin-key";
    process.env.TPAY_MODE = "test";
    delete process.env.ALLOW_PAYMENT_SIMULATION;
    process.env.NODE_ENV = "development";
    clearCloudSrcCache();
    stubCommonDeps({ paymentUpdates: [] });
    let webhook = require("../src/webhook");

    let res = mockRes();
    await webhook.webhookHandler(
      {
        method: "POST",
        rawBody: Buffer.from('{"data":{"orderId":"T1","transactionStatus":"correct"}}'),
        headers: { "x-test-key": "test-admin-key" },
      },
      res
    );
    assert.equal(res.statusCode, 403, "webhook test mode requires ALLOW_PAYMENT_SIMULATION");

    process.env.ALLOW_PAYMENT_SIMULATION = "true";
    process.env.NODE_ENV = "production";
    clearCloudSrcCache();
    stubCommonDeps({ paymentUpdates: [] });
    webhook = require("../src/webhook");
    res = mockRes();
    await webhook.webhookHandler(
      {
        method: "POST",
        rawBody: Buffer.from('{"data":{"orderId":"T1","transactionStatus":"correct"}}'),
        headers: { "x-test-key": "test-admin-key" },
      },
      res
    );
    assert.equal(res.statusCode, 403, "webhook test mode blocked when NODE_ENV=production");

    process.env.NODE_ENV = "development";
    clearCloudSrcCache();
    stubCommonDeps({ paymentUpdates: [] });
    webhook = require("../src/webhook");
    res = mockRes();
    await webhook.webhookHandler(
      {
        method: "POST",
        rawBody: Buffer.from('{"data":{"orderId":"T1","transactionStatus":"correct"}}'),
        headers: {},
      },
      res
    );
    assert.equal(res.statusCode, 401, "webhook test mode requires x-test-key");

    // --- simulateHandler gates ---
    process.env.TPAY_MODE = "sandbox";
    delete process.env.ALLOW_PAYMENT_SIMULATION;
    clearCloudSrcCache();
    stubCommonDeps({ paymentUpdates: [] });
    // simulate requires webhook for applyPaymentStatus — stub chain carefully
    let simulate = require("../src/simulate");
    res = mockRes();
    await simulate.simulateHandler(
      { method: "POST", body: { orderNumber: "T1", outcome: "success" }, headers: {} },
      res
    );
    assert.equal(res.statusCode, 403, "simulate blocked when MODE is not test");

    process.env.TPAY_MODE = "test";
    process.env.ALLOW_PAYMENT_SIMULATION = "true";
    process.env.NODE_ENV = "production";
    clearCloudSrcCache();
    stubCommonDeps({ paymentUpdates: [] });
    simulate = require("../src/simulate");
    res = mockRes();
    await simulate.simulateHandler(
      {
        method: "POST",
        body: { orderNumber: "T1", outcome: "success" },
        headers: { "x-test-key": "test-admin-key" },
      },
      res
    );
    assert.equal(res.statusCode, 403, "simulate blocked when NODE_ENV=production");

    process.env.NODE_ENV = "development";
    clearCloudSrcCache();
    stubCommonDeps({ paymentUpdates: [] });
    simulate = require("../src/simulate");
    res = mockRes();
    await simulate.simulateHandler(
      { method: "POST", body: { orderNumber: "T1", outcome: "success" }, headers: {} },
      res
    );
    assert.equal(res.statusCode, 401, "simulate requires x-test-key");
  });

  it("disabled mode returns 503 before verification", async () => {
    const { webhook } = loadWebhookHandler("disabled");
    const res = mockRes();
    await webhook.webhookHandler(
      { method: "POST", rawBody: Buffer.from("{}"), headers: {} },
      res
    );
    assert.equal(res.statusCode, 503);
  });
});
