import React from "react"
import { Link } from "gatsby"
import PageHeroV2 from "../../components/PageHeroV2/PageHeroV2"
import Seo from "../../components/seo"

const Wyslane2 = ({ location }) => {
  const params = new URLSearchParams(location?.search || "")
  const method = params.get("metoda")
  const order = params.get("zamowienie")
  const isOnline = method === "tpay"

  return (
    <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-gray-100">
      <PageHeroV2
        title={isOnline ? "Płatność potwierdzona" : "Dziękujemy"}
        subtitle="Zamówienie przyjęte"
        description={
          isOnline
            ? "Twoja płatność została zaksięgowana. Potwierdzenie wysyłki otrzymasz mailem."
            : "Zamówienie przyjęte. Dane do przelewu wysłaliśmy e-mailem — sprawdź także spam."
        }
        crumbs={[
          { label: "Strona główna", to: "/" },
          { label: "Koszyk", to: "/koszyk/" },
          { label: "Potwierdzenie" },
        ]}
      />

      <section className="mx-auto max-w-2xl px-4 py-12 text-center sm:px-6 sm:py-16">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/15">
          <svg
            className="h-8 w-8 text-emerald-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        {order && (
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
            Numer zamówienia:{" "}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {order}
            </span>
          </p>
        )}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-[#002C7C] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0C6478] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
          >
            Strona główna
          </Link>
          <Link
            to="/ksiazki/"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C6478] dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Kontynuuj przeglądanie
          </Link>
        </div>
      </section>
    </div>
  )
}

export const Head = () => <Seo title="Zamówienie wysłane" />
export default Wyslane2
