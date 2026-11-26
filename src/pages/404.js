import React from "react"
import { Link } from "gatsby"
import PageHeroV2 from "../components/PageHeroV2/PageHeroV2"
import Seo from "../components/seo"

const NieZnaleziono2 = () => (
  <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-gray-100">
    <PageHeroV2
      title="404"
      subtitle="Strona nie istnieje"
      description="Wygląda na to, że ten adres nie ma odpowiednika w naszej bazie — sprawdź URL albo wróć do strony głównej."
      crumbs={[
        { label: "Strona główna", to: "/" },
        { label: "404" },
      ]}
      actions={
        <>
          <Link
            to="/"
            className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#002C7C] transition hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
          >
            Strona główna
          </Link>
          <Link
            to="/kursy/"
            className="inline-flex rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
          >
            Kursy
          </Link>
        </>
      }
    />

    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/kursy/"
          className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-[#0C6478] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317] dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 className="font-bold text-[#002C7C] dark:text-sky-300">Kursy</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Aktualna oferta szkoleń CEEA
          </p>
        </Link>
        <Link
          to="/kontakt/"
          className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-[#0C6478] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317] dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 className="font-bold text-[#002C7C] dark:text-sky-300">Kontakt</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Napisz, jeśli coś nie działa
          </p>
        </Link>
        <Link
          to="/faq/"
          className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-[#0C6478] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317] dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 className="font-bold text-[#002C7C] dark:text-sky-300">FAQ</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Częste pytania
          </p>
        </Link>
        <Link
          to="/ksiazki/"
          className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-[#0C6478] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317] dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 className="font-bold text-[#002C7C] dark:text-sky-300">Książki</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Katalog publikacji
          </p>
        </Link>
      </div>
    </section>
  </div>
)

export const Head = () => <Seo title="Nie znaleziono strony | CEEA" />
export default NieZnaleziono2
