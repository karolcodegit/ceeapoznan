// src/pages/platnosc-status.js – status płatności (powrót z tpay / symulatora)
import React, { useEffect, useState } from "react"
import { Link } from "gatsby"

const API = process.env.GATSBY_REGISTER_ENDPOINT

// ── Ikony SVG (profesjonalne, ostre w każdym rozmiarze) ──
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
const IconHome = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
  </svg>
)

const CONFIG = {
  paid: {
    icon: IconCheck,
    iconBg: "bg-green-100 dark:bg-green-500/15",
    iconColor: "text-green-600",
    title: "Płatność potwierdzona",
    descCourse: "Twoje miejsce na kursie jest zarezerwowane. Potwierdzenie i faktura zostaną przesłane mailem.",
    descBook: "Twoja płatność za książki została zaksięgowana. Przystępujemy do przygotowania wysyłki – potwierdzenie wyślemy mailem.",
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
    iconBg: "bg-red-100 dark:bg-red-500/15",
    iconColor: "text-red-600",
    title: "Płatność anulowana",
    desc: "Transakcja została przerwana. Jeśli chcesz sfinalizować zamówienie, spróbuj ponownie.",
  },
  expired: {
    icon: IconClock,
    iconBg: "bg-red-100 dark:bg-red-500/15",
    iconColor: "text-red-600",
    title: "Płatność wygasła",
    desc: "Sesja płatności wygasła. Zamówienie nadal czeka – rozpocznij płatność od nowa z linku w mailu.",
  },
}

const PlatnoscStatusPage = ({ location }) => {
  const order = new URLSearchParams(location.search).get("order")
  const [state, setState] = useState({ loading: true })

  useEffect(() => {
    if (!order || !API) {
      setState({ loading: false, error: "Brak numeru zamówienia lub konfiguracji" })
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

  // ── Stan ładowania: skeleton (spójny rozmiar, brak przeskoków) ──
  if (state.loading) {
    return (
      <div className="max-w-md mx-auto py-24 px-4">
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-md p-8">
          <div className="w-14 h-14 mx-auto rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-6 w-2/3 mx-auto mt-5 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-4 w-1/2 mx-auto mt-3 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-4 w-3/4 mx-auto mt-6 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
        </div>
      </div>
    )
  }

  // ── Błąd ──
  if (state.error) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-red-200 dark:border-red-500/30 shadow-md p-8">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-100 dark:bg-red-500/15 flex items-center justify-center">
            <IconX className="w-7 h-7 text-red-600" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Nie znaleziono zamówienia</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{state.error}</p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
          >
            <IconHome className="w-4 h-4" /> Strona główna
          </Link>
        </div>
      </div>
    )
  }

  // ── Status ──
  const c = CONFIG[state.data.status] || CONFIG.awaiting_payment
  const Icon = c.icon
  const desc = state.data.status === "paid"
    ? (state.data.kind === "book" ? c.descBook : c.descCourse)
    : c.desc

  return (
    <div className="max-w-md mx-auto py-16 sm:py-24 px-4 text-center">
      <div className="rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-md p-8">
        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${c.iconBg}`}>
          <Icon className={`w-8 h-8 ${c.iconColor}`} />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-gray-900 dark:text-white">{c.title}</h1>

        <div className="mt-5 inline-flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-700/40 rounded-xl px-5 py-3">
          <span>Zamówienie: <span className="font-semibold text-gray-900 dark:text-white">{state.data.orderNumber}</span></span>
          <span>Kwota: <span className="font-semibold text-gray-900 dark:text-white">{Number(state.data.amount).toFixed(2)} {state.data.currency}</span></span>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{desc}</p>

        <div className="mt-7">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
          >
            <IconHome className="w-4 h-4" /> Strona główna
          </Link>
        </div>
      </div>

      <p className="mt-6 text-xs text-gray-400 dark:text-gray-500">
        W razie pytań: <a href="mailto:sekretariat@ceea.org.pl" className="underline hover:text-gray-600 dark:hover:text-gray-300">sekretariat@ceea.org.pl</a>
      </p>
    </div>
  )
}

export default PlatnoscStatusPage