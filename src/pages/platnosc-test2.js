import React, { useMemo, useState } from "react"
import { navigate } from "gatsby"
import PageHeroV2 from "../components/PageHeroV2/PageHeroV2"
import Seo from "../components/seo"

const API = process.env.GATSBY_REGISTER_ENDPOINT
const KEY = process.env.GATSBY_TEST_KEY
const IS_DEV = process.env.NODE_ENV === "development"

/** Tylko bezpieczny fragment numeru zamówienia (bez query-injection). */
function sanitizeOrder(raw) {
  const value = String(raw || "").trim()
  if (!/^[A-Za-z0-9._-]{1,64}$/.test(value)) return null
  return value
}

const PlatnoscTest2 = ({ location }) => {
  const orderRaw = new URLSearchParams(location.search).get("order")
  const order = useMemo(() => sanitizeOrder(orderRaw), [orderRaw])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const simulate = async outcome => {
    if (!IS_DEV) {
      setResult("Symulator dostępny tylko w trybie development.")
      return
    }
    if (!order) {
      setResult("Nieprawidłowy numer zamówienia.")
      return
    }
    if (!API || !KEY) {
      setResult("Brak GATSBY_REGISTER_ENDPOINT lub GATSBY_TEST_KEY w .env")
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API}/simulate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-test-key": KEY,
        },
        body: JSON.stringify({ orderNumber: order, outcome }),
      })
      const text = await res.text()
      let json = {}
      try {
        json = JSON.parse(text)
      } catch {
        /* empty */
      }

      if (!res.ok) {
        setResult(
          json.error || `HTTP ${res.status}: ${text.slice(0, 120)}`
        )
      } else {
        setResult(
          `Symulacja: ${outcome}${
            json.changed === false ? " (już było – brak zmian)" : ""
          }`
        )
        if (outcome === "success") {
          setTimeout(
            () =>
              navigate(
                `/platnosc-status2?order=${encodeURIComponent(order)}`
              ),
            1500
          )
        }
      }
    } catch (e) {
      setResult(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-gray-100">
      <PageHeroV2
        title="Tryb testowy płatności"
        subtitle="Symulator tpay"
        description="Strona deweloperska — bez prawdziwej płatności. Działa tylko lokalnie (development) przy TPAY_MODE=test."
        crumbs={[
          { label: "Strona główna", to: "/home2/" },
          { label: "Test płatności" },
        ]}
      />

      <section className="mx-auto max-w-md px-4 py-12 sm:px-6 sm:py-16">
        {!IS_DEV ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-500/30 dark:bg-rose-950/40">
            <p className="text-sm font-medium text-rose-800 dark:text-rose-200">
              Symulator płatności jest wyłączony poza trybem development.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-[#E8A317] bg-[#F7F4EF] p-6 text-center sm:p-8 dark:bg-slate-900">
            <p className="break-all text-sm text-slate-600 dark:text-slate-300">
              Zamówienie: <b>{order || "brak / nieprawidłowe"}</b>
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => simulate("success")}
                disabled={loading || !order}
                className="min-h-11 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317] disabled:opacity-50"
              >
                Zasymuluj udaną płatność
              </button>
              <button
                type="button"
                onClick={() => simulate("canceled")}
                disabled={loading || !order}
                className="min-h-11 rounded-full bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317] disabled:opacity-50"
              >
                Zasymuluj porzucenie płatności
              </button>
            </div>
            {result && (
              <p className="mt-4 break-words text-sm font-medium text-slate-800 dark:text-slate-200">
                {result}
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export const Head = () => <Seo title="Test płatności — wariant 2" />
export default PlatnoscTest2
