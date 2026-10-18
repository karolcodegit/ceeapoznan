// cloud/src/products.js — GET /products (publiczna lista książek ze stanem)
// Używane przez ceea.org.pl (Gatsby) zamiast GraphQL/DatoCMS.
const supabase = require("./supabase")

const ALLOWED_ORIGINS = ["https://ceea.org.pl", "http://localhost:8000"]

async function productsHandler(req, res) {
  const origin = req.headers.origin
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin)
  }
  res.set("Cache-Control", "public, max-age=60")

  const { data, error } = await supabase
    .from("products")
    .select(
      "datocms_id,name,author,price,year,available,stock_quantity,image_url,publisher,cover_type,print_on_demand,reprint,additional_info"
    )
    .order("year", { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json({ products: data || [] })
}

module.exports = { productsHandler }
