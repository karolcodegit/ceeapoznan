import React from "react"

const steps = ["koszyk", "dane", "dostawa", "podsumowanie"]
const labels = {
  koszyk: "Koszyk",
  dane: "Dane",
  dostawa: "Dostawa",
  podsumowanie: "Podsumowanie",
}

const CheckoutProgress = ({ currentStep }) => {
  const currentIndex = steps.indexOf(currentStep)

  return (
    <nav
      aria-label="Postęp zamówienia"
      className="overflow-x-auto py-4 sm:py-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ol className="mx-auto flex min-w-max items-center justify-center gap-3 px-1 sm:gap-6">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex
          const isActive = index === currentIndex

          return (
            <li key={step} className="flex items-center gap-2">
              <div
                aria-current={isActive ? "step" : undefined}
                className={`
                  flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors duration-300 sm:h-8 sm:w-8
                  ${isCompleted ? "bg-green-600 text-white dark:bg-green-500 dark:text-gray-900" : ""}
                  ${isActive ? "border-2 border-green-600 text-green-600 dark:border-green-500 dark:text-green-400" : ""}
                  ${!isCompleted && !isActive ? "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-300" : ""}
                `}
              >
                <span className="sr-only">{labels[step]}: </span>
                {isCompleted ? "✓" : index + 1}
              </div>
              <div className="hidden text-sm font-medium text-gray-700 dark:text-gray-300 sm:block">
                {labels[step]}
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default CheckoutProgress
