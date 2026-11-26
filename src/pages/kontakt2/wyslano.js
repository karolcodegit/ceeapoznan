import React from "react"
import { Link } from "gatsby"
import PageHeroV2 from "../../components/PageHeroV2/PageHeroV2"
import Seo from "../../components/seo"

const Wyslano2 = () => {
  return (
    <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-gray-100">
      <PageHeroV2
        title="Wiadomość wysłana"
        subtitle="Dziękujemy za kontakt"
        description="Twój formularz został pomyślnie wysłany. Odpowiemy najszybciej, jak to możliwe."
        crumbs={[
          { label: "Strona główna", to: "/home2/" },
          { label: "Kontakt", to: "/kontakt2/" },
          { label: "Wysłano" },
        ]}
        actions={
          <Link
            to="/home2/"
            className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#002C7C] transition hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
          >
            Strona główna
          </Link>
        }
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
        <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
          W międzyczasie możesz wrócić do{" "}
          <Link
            to="/faq2/"
            className="font-semibold text-[#0C6478] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
          >
            FAQ
          </Link>{" "}
          albo przejrzeć{" "}
          <Link
            to="/kursy2/"
            className="font-semibold text-[#0C6478] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
          >
            kursy
          </Link>
          .
        </p>
      </section>
    </div>
  )
}

export const Head = () => <Seo title="Formularz wysłany — wariant 2" />
export default Wyslano2
