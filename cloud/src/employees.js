// cloud/src/employees.js — GET /employees (aktywni pracownicy, po kolejności)
// Opcjonalnie ?role=Administracja — filtr roli jak w starym GraphQL.
const supabase = require("./supabase");

const ALLOWED_ORIGINS = ["https://ceea.org.pl", "http://localhost:8000"];

async function employeesHandler(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }
  res.set("Cache-Control", "public, max-age=500"); // 5 min

  let query = supabase
    .from("employees")
    .select("name,surname,degree,role,phone,second_phone,email,sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const role = req.query?.role;
  if (role) query = query.eq("role", String(role));

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ employees: data || [] });
}

module.exports = { employeesHandler };
