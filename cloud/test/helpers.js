"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

function openssl(args) {
  execFileSync("openssl", args, { stdio: ["ignore", "pipe", "pipe"] });
}

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

/** Create a throwaway CA + leaf cert pair under a temp dir. */
function makeCertPair(label) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `tpay-${label}-`));
  const caKey = path.join(dir, "ca.key");
  const caPem = path.join(dir, "ca.pem");
  const leafKey = path.join(dir, "leaf.key");
  const leafCsr = path.join(dir, "leaf.csr");
  const leafPem = path.join(dir, "leaf.pem");
  openssl([
    "req", "-x509", "-newkey", "rsa:2048", "-keyout", caKey, "-out", caPem,
    "-days", "1", "-nodes", "-subj", `/CN=CEEA ${label} CA`,
  ]);
  openssl([
    "req", "-newkey", "rsa:2048", "-keyout", leafKey, "-out", leafCsr,
    "-nodes", "-subj", `/CN=CEEA ${label} Leaf`,
  ]);
  openssl([
    "x509", "-req", "-in", leafCsr, "-CA", caPem, "-CAkey", caKey,
    "-CAcreateserial", "-out", leafPem, "-days", "1",
  ]);
  return {
    dir,
    caPem: fs.readFileSync(caPem, "utf8"),
    leafPem: fs.readFileSync(leafPem, "utf8"),
    leafKeyPem: fs.readFileSync(leafKey, "utf8"),
  };
}

function notificationBody(orderId = "ORD-1") {
  return Buffer.from(
    JSON.stringify({
      data: {
        orderId,
        transactionStatus: "correct",
        transactionAmount: 10,
        transactionPaidAmount: 10,
        transactionCurrency: "PLN",
        transactionId: "tx-1",
      },
    })
  );
}

function mockFetchPemMap(map) {
  return async (url) => {
    const pem = map[url];
    if (!pem) throw new Error(`unexpected fetch ${url}`);
    return {
      ok: true,
      status: 200,
      arrayBuffer: async () => Buffer.from(pem, "utf8"),
    };
  };
}

function mockRes() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

function clearCloudSrcCache() {
  for (const id of Object.keys(require.cache)) {
    if (id.includes(`${path.sep}cloud${path.sep}src${path.sep}`)) {
      delete require.cache[id];
    }
  }
}

function stubModule(relativeFromSrc, exports) {
  // Resolve the same way production code does (e.g. email/templates → index.js).
  const resolved = require.resolve("./" + relativeFromSrc.replace(/\\/g, "/"), {
    paths: [path.join(__dirname, "..", "src")],
  });
  require.cache[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports,
  };
  return resolved;
}

module.exports = {
  b64url,
  signDetachedJws,
  makeCertPair,
  notificationBody,
  mockFetchPemMap,
  mockRes,
  clearCloudSrcCache,
  stubModule,
};
