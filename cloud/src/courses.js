// cloud/src/courses.js — GET /courses (kursy dla strony publicznej)
// Zwraca kursy z polami strony głównej, listingu i strony kursu.
const supabase = require("./supabase");

const ALLOWED_ORIGINS = ["https://ceea.org.pl", "http://localhost:8000"];

async function coursesHandler(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }
  res.set("Cache-Control", "public, max-age=60");

  const scope = req.query?.scope || "all"; // all | home (bez archiwum)

  let query = supabase
    .from("courses")
    .select(
      "course_id,title,course_number,date_label,start_date,end_date," +
      "available,is_next,is_new,is_archive,is_online,language," +
      "description,home_description,image_url,background_image_url," +
      "info_description,info_image_url,info_email,info_phone,info_password,info_prices,info_additional," +
      "participation_condition,hotel_image_url,hotel_extra," +
      "price,points,program,meal_options,dishes"
    )
    .order("start_date", { ascending: false, nullsFirst: false });

  if (scope === "home") query = query.eq("is_archive", false);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ courses: data || [] });
}

module.exports = { coursesHandler };
