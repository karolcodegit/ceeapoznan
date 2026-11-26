import React, { useState } from "react"
import { navigate } from "gatsby"
import PageHeroV2 from "../components/PageHeroV2/PageHeroV2"
import Seo from "../components/seo"

const API = process.env.GATSBY_REGISTER_ENDPOINT
const KEY = process.env.GATSBY_TEST_KEY

const PlatnoscTest2 = ({ location }) => {
  const order = new URLSearchParams(location.search).get("order") || "?"
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const simulate = async outcome => {
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
            () => navigate("/platnosc-status2?order=" + order),
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
        description="Strona deweloperska — bez prawdziwej płatności. Działa tylko gdy backend jest w TPAY_MODE=test."
        crumbs={[
          { label: "Strona główna", to: "/home2/" },
          { label: "Test płatności" },
        ]}
      />

      <section className="mx-auto max-w-md px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-3xl border-2 border-dashed border-[#E8A317] bg-[#F7F4EF] p-8 text-center dark:bg-slate-900">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Zamówienie: <b>{order}</b>
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => simulate("success")}
              disabled={loading}
              className="rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317] disabled:opacity-50"
            >
              Zasymuluj udaną płatność
            </button>
            <button
              type="button"
              onClick={() => simulate("canceled")}
              disabled={loading}
              className="rounded-full bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317] disabled:opacity-50"
            >
              Zasymuluj porzucenie płatności
            </button>
          </div>
          {result && (
            <p className="mt-4 text-sm font-medium text-slate-800 dark:text-slate-200">
              {result}
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

export const Head = () => <Seo title="Test płatności — wariant 2" />
export default PlatnoscTest2
