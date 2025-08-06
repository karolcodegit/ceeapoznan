import React, { useState } from "react"
import KoszykPage from "../../pages/koszyk"
import Dane from "../../pages/koszyk/dane"
import Dostawa from "../../pages/koszyk/dostawa"
import Podsumowanie from "../../pages/koszyk/podsumowanie"

const CheckoutPage = () => {
  const [currentStep, setCurrentStep] = useState("dane")
  const steps = ["koszyk", "dane", "dostawa", "podsumowanie"]

  const handleNext = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case "koszyk":
        return <KoszykPage onNext={handleNext} onBack={handleBack} />
      case "dane":
        return <Dane onNext={handleNext} onBack={handleBack} />
      case "dostawa":
        return <Dostawa onNext={handleNext} onBack={handleBack} />
      case "podsumowanie":
        return <Podsumowanie onNext={handleNext} onBack={handleBack} />
      default:
        return null
    }
  }

  return <>{renderStep()}</>
}

export default CheckoutPage
