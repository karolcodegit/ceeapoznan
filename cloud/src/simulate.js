// cloud/src/simulate.js – POST /simulate (TYLKO gdy TPAY_MODE=test)
// Symulator bramki tpay: zmienia status płatności jak prawdziwy webhook.
// Wywoływana ze strony /platnosc-test (klucz admina w URL – WYŁĄCZNIE do testów!).
const { MODE } = require("./tpay");
const { applyPaymentStatus } = require("./webhook");

async function simulateHandler(req, res) {
  if (MODE !== "test") {
    return res.status(403).json({ error: "Dostępne tylko w TPAY_MODE=test" });
  }
  if (req.headers["x-test-key"] !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { orderNumber, outcome } = req.body || {};
  if (!orderNumber || !["success", "canceled"].includes(outcome)) {
    return res.status(400).json({ error: "Brak orderNumber lub zły outcome" });
  }

  const result = await applyPaymentStatus(orderNumber, outcome);
  if (result.error === "not_found") return res.status(404).json({ error: "Nie znaleziono" });

  return res.json({ ok: true, outcome, changed: result.changed });
}

module.exports = { simulateHandler };
