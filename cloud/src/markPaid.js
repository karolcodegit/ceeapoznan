// cloud/src/markPaid.js – POST /mark-paid
// Sekretariat klika "Zaksięgowano wpłatę" → status paid + mail do kursanta.
// TA SAMA logika co webhook/simulate (jedna funkcja applyPaymentStatus).
const { applyPaymentStatus } = require("./webhook");

async function markPaidHandler(req, res) {
  if (req.headers["x-admin-key"] !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { orderNumber } = req.body || {};
  if (!orderNumber) return res.status(400).json({ error: "Brak orderNumber" });

  const result = await applyPaymentStatus(orderNumber, "success");
  if (result.error === "not_found") return res.status(404).json({ error: "Nie znaleziono zgłoszenia" });

  return res.json({ ok: true, orderNumber, changed: result.changed });
}

module.exports = { markPaidHandler };
