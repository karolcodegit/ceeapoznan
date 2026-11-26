import React from "react"
import { Link } from "gatsby"
import PageHeroV2 from "../PageHeroV2/PageHeroV2"
import CheckoutProgress from "../CheckoutProgress/CheckoutProgress"

const CheckoutShellV2 = ({
  title,
  subtitle,
  description,
  currentStep,
  children,
}) => {
  return (
    <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-gray-100">
      <PageHeroV2
        title={title}
        subtitle={subtitle}
        description={description}
        crumbs={[
          { label: "Strona główna", to: "/home2/" },
          { label: "Książki", to: "/ksiazki2/" },
          { label: "Koszyk" },
        ]}
        actions={
          <Link
            to="/ksiazki2/"
            className="inline-flex rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
          >
            Wróć do książek
          </Link>
        }
      />
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {currentStep ? <CheckoutProgress currentStep={currentStep} /> : null}
        <div className="mt-2">{children}</div>
      </section>
    </div>
  )
}

export default CheckoutShellV2
