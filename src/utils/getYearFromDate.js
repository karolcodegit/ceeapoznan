export const getYearFromDate = (date) => {
  if (!date) return 'brak-roku'; // Dla kursów bez daty
  // Format ISO z bazy: "2026-10-05"
  if (/^\d{4}-\d{2}-\d{2}/.test(date)) return date.slice(0, 4);
  const dateParts = date.split('.');
  if (dateParts.length > 1) {
    return dateParts[2].slice(-4); // Dla dat w formacie np. "8-10.05.2025"
  }
  return date.length === 4 ? date : 'brak-roku'; // Dla kursów z rokiem np. "2025"
};