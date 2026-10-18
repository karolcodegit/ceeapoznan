// cloud/src/company.js — GET /company (pojedynczy rekord company_settings, id=1)
// Używane przez ceea.org.pl (Gatsby): strona Kontakt + Footer.
const supabase = require("./supabase");

const ALLOWED_ORIGINS = ["https://ceea.org.pl", "http://localhost:8000"];

async function companyHandler(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }
  res.set("Cache-Control", "public, max-age=3600"); // 1 h – dane firmy prawie się nie zmieniają

  const { data, error } = await supabase
    .from("company_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ company: data });
}

module.exports = { companyHandler };
