const functions = require("@google-cloud/functions-framework");
const { createClient } = require("@supabase/supabase-js");
const cors = require("cors");

const corsHandler = cors({ origin: true });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const MAX_SEATS = Number(process.env.MAX_SEATS_PER_COURSE || 100);
// Statusy rezerwujące miejsce: ktoś czeka z wpłatą też blokuje slot
const ACTIVE_STATUSES = ["awaiting_transfer", "awaiting_payment", "paid"];

functions.http("course-register", async (req, res) => {
  corsHandler(req, res, async () => {
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "POST");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      return res.status(204).send("");
    }
    if (req.method !== "POST") return res.status(405).send("Method not allowed");

    try {
      const {
        orderNumber, email, firstName, surName, phone,
        courseId, courseTitle, amount, paymentFee, paymentMethod,
        payload, // pełne dane formularza (jsonb)
      } = req.body || {};

      if (!orderNumber || !email || !courseId || !amount) {
        return res.status(400).json({ error: "Brak wymaganych pól" });
      }

      // ── Limit miejsc (100) – sprawdzany w czasie rzeczywistym ──
      const { count } = await supabase
        .from("payments")
        .select("id", { count: "exact", head: true })
        .eq("course_id", String(courseId))
        .in("status", ACTIVE_STATUSES);

      // Idempotentność: ponowny zapis TEGO SAMEGO orderNumber zawsze przechodzi
      const { data: existing } = await supabase
        .from("payments")
        .select("id")
        .eq("order_number", orderNumber)
        .maybeSingle();

      if (!existing && (count ?? 0) >= MAX_SEATS) {
        return res.status(409).json({ error: "Brak wolnych miejsc na tym kursie." });
      }

      // ── 1. Użytkownik (upsert po emailu) ──
      const { data: user, error: userError } = await supabase
        .from("users")
        .upsert(
          { email, name: firstName || null, surname: surName || null, phone: phone || null },
          { onConflict: "email" }
        )
        .select()
        .single();
      if (userError) throw userError;

      // ── 2. Płatność (upsert po order_number – powtórka = no-op) ──
      const method = paymentMethod === "tpay" ? "tpay" : "transfer";
      const { error: payError } = await supabase
        .from("payments")
        .upsert(
          {
            order_number: orderNumber,
            user_id: user.id,
            course_id: String(courseId),
            amount: Math.round(Number(amount) * 100) / 100,
            currency: "PLN",
            method,
            status: method === "tpay" ? "awaiting_payment" : "awaiting_transfer",
            payload: payload || null,          // pełne dane formularza
            notes: JSON.stringify({ paymentFee: paymentFee || 0, courseTitle }),
          },
          { onConflict: "order_number" }
        );
      if (payError) throw payError;

      console.log(`✅ Zapisano ${orderNumber} (${method}), zajęte miejsca: ${count ?? 0}/${MAX_SEATS}`);
      return res.status(200).json({ ok: true, orderNumber });
    } catch (error) {
      console.error("❌ course-register error:", error.message);
      return res.status(500).json({ error: error.message });
    }
  });
});