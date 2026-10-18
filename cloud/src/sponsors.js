// cloud/src/sponsors.js — GET /sponsors (aktywni sponsorzy, po kolejności)
// Używane przez ceea.org.pl (Gatsby) zamiast GraphQL/DatoCMS.
const supabase = require("./supabase");

const ALLOWED_ORIGINS = ["https://ceea.org.pl", "http://localhost:8000"];

async function sponsorsHandler(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }
  res.set("Cache-Control", "public, max-age=800"); // 5 min – sponsorzy rzadko się zmieniają

  const { data, error } = await supabase
    .from("sponsors")
    .select("name,logo_url,website_url,sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ sponsors: data || [] });
}

module.exports = { sponsorsHandler };
