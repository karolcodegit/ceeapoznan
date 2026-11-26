import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import PageHeroV2 from "../components/PageHeroV2/PageHeroV2"
import Seo from "../components/seo"

const API = process.env.GATSBY_REGISTER_ENDPOINT

const IconCheck = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
)
const IconClock = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)
const IconX = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const CONFIG = {
  paid: {
    icon: IconCheck,
    iconBg: "bg-emerald-100 dark:bg-emerald-500/15",
    iconColor: "text-emerald-600",
    title: "Płatność potwierdzona",
    descCourse:
      "Twoje miejsce na kursie jest zarezerwowane. Potwierdzenie i faktura zostaną przesłane mailem.",
    descBook:
      "Twoja płatność za książki została zaksięgowana. Przystępujemy do przygotowania wysyłki.",
  },
  awaiting_payment: {
    icon: IconClock,
    iconBg: "bg-amber-100 dark:bg-amber-500/15",
    iconColor: "text-amber-600",
    title: "Oczekujemy na płatność",
    desc: "Płatność online nie została dokończona. Link do dokończenia otrzymałeś w mailu.",
  },
  awaiting_transfer: {
    icon: IconClock,
    iconBg: "bg-amber-100 dark:bg-amber-500/15",
    iconColor: "text-amber-600",
    title: "Oczekujemy na przelew",
    desc: "Twoja rejestracja jest zapisana. Dane do przelewu znajdziesz w mailu potwierdzającym.",
  },
  canceled: {
    icon: IconX,
    iconBg: "bg-rose-100 dark:bg-rose-500/15",
    iconColor: "text-rose-600",
    title: "Płatność anulowana",
    desc: "Transakcja została przerwana. Jeśli chcesz sfinalizować zamówienie, spróbuj ponownie.",
  },
  expired: {
    icon: IconClock,
    iconBg: "bg-rose-100 dark:bg-rose-500/15",
    iconColor: "text-rose-600",
    title: "Płatność wygasła",
    desc: "Sesja płatności wygasła. Zamówienie nadal czeka — rozpocznij płatność od nowa z linku w mailu.",
  },
}

function sanitizeOrder(raw) {
  const value = String(raw || "").trim()
  if (!/^[A-Za-z0-9._-]{1,64}$/.test(value)) return null
  return value
}

const PlatnoscStatus2 = ({ location }) => {
  const order = sanitizeOrder(
    new URLSearchParams(location.search).get("order")
  )
  const [state, setState] = useState({ loading: true })

  useEffect(() => {
    if (!order || !API) {
      setState({
        loading: false,
        error: "Brak numeru zamówienia lub konfiguracji",
      })
      return
    }
    fetch(`${API}/order-status?orderNumber=${encodeURIComponent(order)}`)
      .then(async res => {
        const json = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(json.error || "HTTP " + res.status)
        return json
      })
      .then(data => setState({ loading: false, data }))
      .catch(e => setState({ loading: false, error: e.message }))
  }, [order])

  const heroTitle = state.loading
    ? "Status płatności"
    : state.error
      ? "Nie znaleziono"
      : CONFIG[state.data?.status]?.title || "Status płatności"

  return (
    <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-gray-100">
      <PageHeroV2
        title={heroTitle}
        subtitle="Płatność"
        description="Informacja o statusie transakcji kursu lub zamówienia książek."
        crumbs={[
          { label: "Strona główna", to: "/home2/" },
          { label: "Status płatności" },
        ]}
      />

      <section className="mx-auto max-w-md px-4 py-12 sm:px-6 sm:py-16">
        {state.loading && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto h-14 w-14 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="mx-auto mt-5 h-6 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mx-auto mt-3 h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        )}

        {!state.loading && state.error && (
          <div className="rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm dark:border-rose-500/30 dark:bg-slate-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/15">
              <IconX className="h-7 w-7 text-rose-600" />
            </div>
            <h2 className="mt-4 text-xl font-bold">Nie znaleziono zamówienia</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {state.error}
            </p>
            <Link
              to="/home2/"
              className="mt-6 inline-flex rounded-full bg-[#002C7C] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0C6478] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
            >
              Strona główna
            </Link>
          </div>
        )}

        {!state.loading && !state.error && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            {(() => {
              const c = CONFIG[state.data.status] || CONFIG.awaiting_payment
              const Icon = c.icon
              const desc =
                state.data.status === "paid"
                  ? state.data.kind === "book"
                    ? c.descBook
                    : c.descCourse
                  : c.desc
              return (
                <>
                  <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${c.iconBg}`}
                  >
                    <Icon className={`h-8 w-8 ${c.iconColor}`} />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold">{c.title}</h2>
                  <div className="mt-5 inline-flex flex-col gap-1 rounded-xl bg-slate-50 px-5 py-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <span>
                      Zamówienie:{" "}
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {state.data.orderNumber}
                      </span>
                    </span>
                    <span>
                      Kwota:{" "}
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {Number(state.data.amount).toFixed(2)}{" "}
                        {state.data.currency}
                      </span>
                    </span>
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {desc}
                  </p>
                  <Link
                    to="/home2/"
                    className="mt-7 inline-flex rounded-full bg-[#002C7C] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0C6478] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
                  >
                    Strona główna
                  </Link>
                </>
              )
            })()}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          W razie pytań:{" "}
          <a
            href="mailto:sekretariat@ceea.org.pl"
            className="underline hover:text-slate-600 dark:hover:text-slate-300"
          >
            sekretariat@ceea.org.pl
          </a>
        </p>
      </section>
    </div>
  )
}

export const Head = () => <Seo title="Status płatności — wariant 2" />
export default PlatnoscStatus2
