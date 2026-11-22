// cloud/src/simulate.js – POST /simulate (TYLKO gdy TPAY_MODE=test)
// Symulator bramki tpay: zmienia status płatności jak prawdziwy webhook.
// Test-only endpoint. It requires an explicit server-side opt-in and admin key.
const { MODE } = require("./tpay");
const { applyPaymentStatus } = require("./webhook");
const { requireAdminKey } = require("./adminAuth");

async function simulateHandler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (
    MODE !== "test" ||
    process.env.NODE_ENV === "production" ||
    process.env.ALLOW_PAYMENT_SIMULATION !== "true"
  ) {
    return res.status(403).json({ error: "Dostępne tylko w TPAY_MODE=test" });
  }
  if (!requireAdminKey(req, res, "x-test-key")) return;

  const { orderNumber, outcome } = req.body || {};
  if (!orderNumber || !["success", "canceled"].includes(outcome)) {
    return res.status(400).json({ error: "Brak orderNumber lub zły outcome" });
  }

  const result = await applyPaymentStatus(orderNumber, outcome, { source: "simulation" });
  if (result.error === "not_found") return res.status(404).json({ error: "Nie znaleziono" });
  if (result.error === "amount_mismatch") return res.status(409).json({ error: "Kwota zamówienia nie zgadza się z wyliczoną ceną." });

  return res.json({ ok: true, outcome, changed: result.changed });
}

module.exports = { simulateHandler };
