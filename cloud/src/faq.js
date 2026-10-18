// cloud/src/faq.js — GET /faq (aktywne pytania, po kolejności)
// Używane przez ceea.org.pl (Gatsby) zamiast GraphQL/DatoCMS.
const supabase = require("./supabase");

const ALLOWED_ORIGINS = ["https://ceea.org.pl", "http://localhost:8000"];

async function faqHandler(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }
  res.set("Cache-Control", "public, max-age=500"); // 5 min – FAQ rzadko się zmienia

  const { data, error } = await supabase
    .from("faq_items")
    .select("question,answer,sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ faq: data || [] });
}

module.exports = { faqHandler };
