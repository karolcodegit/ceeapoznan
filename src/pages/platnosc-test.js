// src/pages/platnosc-test.js – SYMULATOR bramki płatności (dev/test)
// Działa tylko gdy backend w TPAY_MODE=test. USUŃ przed produkcją.
import React, { useState } from "react"
import { navigate } from "gatsby"

// Ten sam endpoint co rejestracja (pełny URL serwisu Cloud Run)
const API = process.env.GATSBY_REGISTER_ENDPOINT
const KEY = process.env.GATSBY_TEST_KEY // = ADMIN_KEY – TYLKO do testów lokalnych!

const PlatnoscTestPage = ({ location }) => {
  const order = new URLSearchParams(location.search).get("order") || "?"
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const simulate = async outcome => {
    if (!API || !KEY) {
      setResult("❌ Brak GATSBY_REGISTER_ENDPOINT lub GATSBY_TEST_KEY w .env")
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API}/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-test-key": KEY },
        body: JSON.stringify({ orderNumber: order, outcome }),
      })
      const text = await res.text() // bezpieczniejsze niż od razu .json()
      let json = {}
      try { json = JSON.parse(text) } catch { /* pusta odpowiedź */ }

      if (!res.ok) {
        setResult(`❌ ${json.error || ("HTTP " + res.status + ": " + text.slice(0, 120))}`)
      } else {
        setResult(`✅ Symulacja: ${outcome}${json.changed === false ? " (już było – brak zmian)" : ""}`)
        if (outcome === "success") {
          setTimeout(() => navigate("/platnosc-status?order=" + order), 1500)
        }
      }
    } catch (e) {
      setResult("❌ " + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-20 px-4 text-center">
      <div className="rounded-2xl border-4 border-dashed border-amber-400 bg-amber-50 p-8">
        <h1 className="text-2xl font-bold text-amber-800">🧪 TRYB TESTOWY</h1>
        <p className="mt-2 text-amber-700">
          To symulator bramki tpay – bez prawdziwej płatności.
        </p>
        <p className="mt-4 text-sm text-gray-600">Zamówienie: <b>{order}</b></p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => simulate("success")}
            disabled={loading}
            className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            Zasymuluj UDANĄ płatność
          </button>
          <button
            onClick={() => simulate("canceled")}
            disabled={loading}
            className="rounded-xl bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-600 disabled:opacity-50"
          >
            Zasymuluj porzucenie płatności
          </button>
        </div>
        {result && <p className="mt-4 font-medium">{result}</p>}
      </div>
    </div>
  )
}

export default PlatnoscTestPage