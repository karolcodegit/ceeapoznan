import React from "react"

const steps = ["koszyk", "dane", "dostawa", "podsumowanie"];
const labels = {
  koszyk: "Koszyk",
  dane: "Dane",
  dostawa: "Dostawa",
  podsumowanie: "Podsumowanie",
};

const CheckoutProgress = ({ currentStep }) => {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="flex justify-center gap-6 py-6">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;

        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${isCompleted ? "bg-green-600 text-white" : ""}
                ${isActive ? "border-2 border-green-600 text-green-600" : ""}
                ${!isCompleted && !isActive ? "bg-gray-200 text-gray-500" : ""}
              `}
            >
              {isCompleted ? "✓" : index + 1}
            </div>
            <div className="hidden sm:block text-sm font-medium text-gray-700">
              {labels[step]}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutProgress
