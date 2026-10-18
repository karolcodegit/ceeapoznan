// cloud/src/notify.js — wpis powiadomienia dla panelu (rejestracje itd.)
const supabase = require("./supabase");

async function notify({ type, title, body = "", link = null }) {
  const { error } = await supabase.from("notifications").insert({ type, title, body, link });
  if (error) console.error("notify:", error.message);
}

module.exports = { notify };
