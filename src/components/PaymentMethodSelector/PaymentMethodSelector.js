import React from "react"

// Ikona karty płatniczej (płatność online)
const CardIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 8.25h18M3 6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 17.25V6.75Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 14.25h4" />
  </svg>
)

// Ikona banku (przelew tradycyjny)
const BankIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 3.75 3.75 8.25h16.5L12 3.75ZM4.5 10.5v6m4.5-6v6m4.5-6v6m4.5-6v6m4.5-6v6M3 20.25h18" />
  </svg>
)

const TPAY_ENABLED = process.env.GATSBY_TPAY_ENABLED === "true"

const paymentMethods = [
  {
    value: "tpay",
    disabled: !TPAY_ENABLED,
    title: "Płatność online",
    subtitle: "BLIK · karta · szybki przelew",
    description:
      "Natychmiastowe potwierdzenie – Twoje zamówienie trafia do realizacji od razu po zaksięgowaniu wpłaty.",
    recommended: true,
    Icon: CardIcon,
  },
  {
    value: "transfer",
    title: "Przelew tradycyjny",
    subtitle: "Na konto bankowe",
    description:
      "Po złożeniu zamówienia otrzymasz dane do przelewu. Realizację rozpoczynamy po zaksięgowaniu wpłaty.",
    recommended: false,
    Icon: BankIcon,
  },
]

/**
 * Selektor metody płatności (karty z radiobutton).
 * Bez animowanych box-shadow – unikamy glitcha renderowania w Edge/Chromium.
 */
const PaymentMethodSelector = ({ name = "paymentMethod", value, onChange }) => {
  return (
    <fieldset className="mt-10">
      <legend className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
        Metoda płatności <span className="text-red-500">*</span>
      </legend>

      <div className="grid sm:grid-cols-2 gap-4" role="radiogroup" aria-label="Metoda płatności">
        {paymentMethods.map(({ value: v, title, subtitle, description, recommended, disabled, Icon }) => (
          <label
            key={v}
            className={`relative block ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            <input
              type="radio"
              name={name}
              value={v}
              checked={value === v}
              onChange={disabled ? undefined : onChange}
              disabled={disabled}
              className="peer sr-only"
            />

            <div
              className={`
                h-full rounded-2xl border-2 border-gray-200 bg-white p-5
                transition-colors duration-150
                peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-400 peer-focus-visible:ring-offset-2
                peer-checked:border-indigo-500 peer-checked:bg-indigo-50/60
                dark:border-gray-700 dark:bg-gray-800
                dark:peer-checked:border-indigo-400 dark:peer-checked:bg-indigo-900/20
                ${disabled
                  ? "opacity-55 bg-gray-50 dark:bg-gray-800/60 pointer-events-none"
                  : "hover:border-gray-300 dark:hover:border-gray-600"}
              `}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="
                      inline-flex items-center justify-center w-10 h-10 rounded-xl
                      bg-gray-100 text-gray-500
                      peer-checked:bg-indigo-100 peer-checked:text-indigo-600
                      dark:bg-gray-700 dark:text-gray-300
                    "
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
                  </div>
                </div>

                {/* Kropka „radio" po prawej */}
                <span
                  className="
                    mt-1 shrink-0 w-5 h-5 rounded-full border-2 border-gray-300
                    grid place-items-center transition-colors
                    peer-checked:border-indigo-500
                    dark:border-gray-600
                  "
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 opacity-0 transition-opacity" />
                </span>
              </div>

              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {description}
              </p>

              {disabled ? (
                <span className="absolute -top-2.5 right-4 inline-flex items-center rounded-full bg-gray-400 dark:bg-gray-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  Wkrótce
                </span>
              ) : recommended ? (
                <span className="absolute -top-2.5 right-4 inline-flex items-center rounded-full bg-indigo-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  Polecane
                </span>
              ) : null}
            </div>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default PaymentMethodSelector