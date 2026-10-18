// cloud/src/validate.js – walidacja i normalizacja zgłoszenia przed zapisem do bazy
// Zasada: serwer NIE ufa frontendowi. Wszystko sprawdzamy tutaj.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Prosty rate limiter w pamięci (na instancję): max N żądań/min z jednego IP
const hits = new Map();
function rateLimit(ip, max = 10, windowMs = 60_000) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < windowMs);
  if (arr.length >= max) return false;
  arr.push(now);
  hits.set(ip, arr);
  // porządki co jakiś czas, żeby mapa nie rosła w nieskończoność
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.length === 0 || now - v[v.length - 1] > 10 * windowMs) hits.delete(k);
  }
  return true;
}

const clean = v => (typeof v === "string" ? v.trim().slice(0, 300) : v);

// Waliduje dane z /register. Zwraca { errors: [], normalized: {...} }
function validateRegistration(d) {
  const errors = [];
  const n = {}; // znormalizowane dane

  // ── Numer zamówienia ──
  n.orderNumber = clean(d.orderNumber);
  if (!/^[A-Za-z0-9-]{8,50}$/.test(n.orderNumber || ""))
    errors.push("Numer zamówienia jest nieprawidłowy.");

  // ── Email ──
  n.email = clean(d.email).toLowerCase();
  if (!EMAIL_RE.test(n.email) || n.email.length > 254)
    errors.push("Adres email jest nieprawidłowy.");

  // ── Imię i nazwisko ──
  n.firstName = clean(d.firstName);
  n.surName = clean(d.surName);
  if (!n.firstName || n.firstName.length < 2) errors.push("Imię jest wymagane (min. 2 znaki).");
  if (!n.surName || n.surName.length < 2) errors.push("Nazwisko jest wymagane (min. 2 znaki).");

  // ── Telefon (opcjonalny, ale jeśli jest – musi wyglądać sensownie) ──
  if (d.phone != null && d.phone !== "") {
    const digits = String(d.phone).replace(/\D/g, "");
    if (digits.length < 9 || digits.length > 15) errors.push("Numer telefonu jest nieprawidłowy.");
    n.phone = digits;
  } else {
    n.phone = null;
  }

  // ── Kurs ──
  n.courseId = clean(d.courseId);
  n.courseTitle = clean(d.courseTitle);
  if (!n.courseId) errors.push("Brak identyfikatora kursu.");
  if (!n.courseTitle) errors.push("Brak nazwy kursu.");

  // ── Kwota bazowa ──
  n.baseAmount = Math.round(Number(d.baseAmount) * 100) / 100;
  if (!Number.isFinite(n.baseAmount) || n.baseAmount <= 0)
    errors.push("Kwota jest nieprawidłowa.");
  else if (n.baseAmount > 1_000_000)
    errors.push("Kwota przekracza dopuszczalny limit.");

  // ── Metoda płatności ──
  n.paymentMethod = d.paymentMethod === "tpay" ? "tpay" : "transfer";

  // ── Faktura: jeśli kursant chce faktury, NIP jest obowiązkowy ──
  const p = d.payload || {};
  if (p && (p.wantsInvoice === true || p.wantsInvoice === "true")) {
    const nip = clean(p.invoiceNip).replace(/[\s-]/g, "");
    if (!/^\d{10}$/.test(nip)) errors.push("Przy fakturze VAT NIP jest wymagany (10 cyfr).");
    else n.invoiceNip = nip;
  }

  // ── Opcjonalne pola formatowe (jeśli podane – sprawdzamy kształt) ──
  if (p.birthday && !/^(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})$/.test(String(p.birthday)))
    errors.push("Data urodzenia ma nieprawidłowy format.");
  if (p.zipCode && !/^\d{2}-\d{3}$/.test(String(p.zipCode).trim()))
    errors.push("Kod pocztowy ma nieprawidłowy format (00-000).");
  if (p.email && !EMAIL_RE.test(String(p.email)))
    errors.push("Email w danych formularza jest nieprawidłowy.");

  // Payload ograniczamy rozmiarem (ochrona przed śmieciami w jsonb)
  let payload = p;
  try {
    const s = JSON.stringify(p);
    if (s.length > 50_000) payload = { truncated: true };
  } catch {
    payload = null;
  }

  return { errors, normalized: { ...n, payload } };
}

module.exports = { validateRegistration, rateLimit };
