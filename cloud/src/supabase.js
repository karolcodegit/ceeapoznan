// cloud/src/supabase.js
// "ws" jako transport dla Node < 22 (na Cloud Run Node 22 natywnie wystarczy,
// ale ten zapis działa wszędzie)
const { createClient } = require("@supabase/supabase-js");
const ws = require("ws");

module.exports = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { realtime: { transport: ws } }
);
