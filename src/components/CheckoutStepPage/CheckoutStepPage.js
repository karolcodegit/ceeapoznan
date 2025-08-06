import React from "react"
import { navigate } from "gatsby"
import Button from '../Button/Button'
import CheckoutProgress from "../CheckoutProgress/CheckoutProgress"

const CheckoutStepPage = ({
    children,
    formRef,
    onBack,
    onNext,
    onSubmit,
    showClearCart = false,
    showSubmit = false,
  }) => {
    const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  
    const handleBack = () => {
      if (onBack) onBack();
      else navigate(getPreviousStep(pathname));
    };
  
    const handleNext = () => {
      if (onNext) {
        onNext();
      } else if (formRef?.current) {
        const isValid = formRef.current.checkValidity();
        if (!isValid) {
          formRef.current.reportValidity();
          return;
        }
        formRef.current.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true })
        );
      }
    };
  
    const getPreviousStep = (path) => {
      switch (path) {
        case "/koszyk/dane":
          return "/koszyk";
        case "/koszyk/dostawa":
          return "/koszyk/dane";
        case "/koszyk/podsumowanie":
          return "/koszyk/dostawa";
        default:
          return "/koszyk";
      }
    };
  
    const handleClearCart = () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart");
        navigate("/koszyk");
      }
    };
  
    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Przekazanie aktualnego kroku do CheckoutProgress */}
        <CheckoutProgress currentStep={pathname.split("/").pop()} />
  
        <div className="my-6">{children}</div>
  
        <div className="flex justify-between gap-4 mt-10">
        {showClearCart ? (
          <Button
            variant="back" 
            onClick={handleClearCart}
          >
            Wyczyść koszyk
          </Button>
        ) : (
          <Button variant="back" onClick={() => {
            handleBack();
          } }>
            Wstecz
          </Button>
        )}

        {showSubmit ? (
          <Button
            type="submit"
            form="step-form"
            onClick={onSubmit}
          >
            Złóż zamówienie
          </Button>
        ) : (
          <Button  onClick={() => {
            handleNext();
          
          }}>
            Przejdź dalej
          </Button>
        )}
      </div>
      </div>
    );
  };

export default CheckoutStepPage