// GET /product-stock?datocmsId=...
const supabase = require("./supabase");
async function productStockHandler(req, res) {
  const id = req.query?.datocmsId;
  if (!id) return res.status(400).json({ error: "Brak datocmsId" });
  const { data } = await supabase.from("products")
    .select("stock_quantity, available").eq("datocms_id", String(id)).maybeSingle();
  res.set("Cache-Control", "public, max-age=30"); // 30 s cache
  res.json({ stock: data?.stock_quantity ?? 0, available: !!data?.available });
}
module.exports = { productStockHandler };