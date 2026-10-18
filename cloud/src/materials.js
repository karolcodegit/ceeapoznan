// cloud/src/materials.js – POST /my-materials
// Zwraca materiały TYLKO gdy spełnione są OBIE bramy:
//   1. użytkownik ma OPŁACONĄ płatność (status paid) za ten kurs
//   2. dzisiaj >= courses.end_date (ostatni dzień kursu)
// Wywołuje go panel kursanta PO zalogowaniu (panel wysyła swój token sesji).
const supabase = require("./supabase");

async function myMaterialsHandler(req, res) {
  // Autoryzacja: panel przekazuje swój sekret + email zalogowanego użytkownika.
  // (Sekret wspólny panel<->serwer; samo zalogowanie weryfikuje panel.)
  if (req.headers["x-panel-secret"] !== process.env.PANEL_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: "Brak email" });

  // Kursant
  const { data: user } = await supabase
    .from("users").select("id").eq("email", email).maybeSingle();
  if (!user) return res.status(404).json({ error: "Nie znaleziono użytkownika" });

  // Dzisiaj (data servera = UTC; dla polskiej daty bezpieczniej liczyć w panelu,
  // ale end_date porównujemy jako data – granica 00:00 dnia końcowego)
  const today = new Date().toISOString().slice(0, 10);

  // Opłacone kursy tego użytkownika
  const { data: paidPayments } = await supabase
    .from("payments")
    .select("course_id")
    .eq("user_id", user.id)
    .eq("status", "paid");

  const paidCourseIds = (paidPayments || []).map(p => p.course_id);
  if (paidCourseIds.length === 0) return res.json({ materials: [] });

  // Które z nich mają dziś (lub po) ostatni dzień kursu?
  const { data: unlockedCourses } = await supabase
    .from("courses")
    .select("course_id")
    .in("course_id", paidCourseIds)
    .lte("end_date", today);

  const unlockedIds = (unlockedCourses || []).map(c => c.course_id);
  if (unlockedIds.length === 0) return res.json({ materials: [] });

  // Materiały tylko z odblokowanych kursów
  const { data: materials } = await supabase
    .from("materials")
    .select("course_id, title, type, url, order_num")
    .in("course_id", unlockedIds)
    .order("order_num", { ascending: true });

  return res.json({ materials: materials || [] });
}

module.exports = { myMaterialsHandler };
