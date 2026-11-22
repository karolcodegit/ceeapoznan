// cloud/src/markPaid.js – POST /mark-paid
// Sekretariat klika "Zaksięgowano wpłatę" → status paid + mail do kursanta.
// TA SAMA logika co webhook/simulate (jedna funkcja applyPaymentStatus).
const { applyPaymentStatus } = require("./webhook");
const { requireAdminKey } = require("./adminAuth");

async function markPaidHandler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!requireAdminKey(req, res)) return;
  const { orderNumber } = req.body || {};
  if (!orderNumber) return res.status(400).json({ error: "Brak orderNumber" });

  const result = await applyPaymentStatus(orderNumber, "success", { source: "admin" });
  if (result.error === "not_found") return res.status(404).json({ error: "Nie znaleziono zgłoszenia" });
  if (result.error === "amount_mismatch") return res.status(409).json({ error: "Kwota zamówienia nie zgadza się z wyliczoną ceną." });

  return res.json({ ok: true, orderNumber, changed: result.changed });
}

module.exports = { markPaidHandler };
