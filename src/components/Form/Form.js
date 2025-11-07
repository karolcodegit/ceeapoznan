// components/Form.js
import React, { useState } from "react"
import PropTypes from "prop-types"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import Button from "../Button/Button"
import { selectDynamicState } from "../../utils/selectors"
import { flattenObject } from "../../utils/flattenObject"

// const flattenObject = (obj, prefix = "") =>
//   Object.keys(obj).reduce((acc, key) => {
//     const value = obj[key];
//     const prefixedKey = prefix ? `${prefix}.${key}` : key;
//     if (typeof value === "object" && value !== null) {
//       Object.assign(acc, flattenObject(value, prefixedKey));
//     } else {
//       acc[prefixedKey] = value;
//     }
//     return acc;
//   }, {});

const Form = React.forwardRef(({
  prepareFormData,
  children,
  submitButtonText = "Wyślij",
  apiEndpoint,
  clearAction,
  notificationMessage = "Dziękujemy! Formularz został wysłany.",
  saveToAirtable, // Funkcja do zapisu danych do Airtable
  formSliceKey = "contact",
  className,
  requiredFields = [],
  onSubmitOverride,
  onSuccess,
  isStepForm = false,
  extraFormData = {},
  dynamicRequiredFields = [],
  variant,
  addToButton,
  padding,
  ...props
}, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const formDataFromRedux = useSelector(state => state[formSliceKey] || {}); // Wywołanie useSelector na najwyższym poziomie
  const [errors, setErrors] = useState({});
  const dynamicState = useSelector(selectDynamicState);
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Obsługa dynamicRequiredFields
    const dynamicFields = typeof dynamicRequiredFields === "function"
      ? dynamicRequiredFields(dynamicState)
      : [];
    const allRequiredFields = [...requiredFields, ...dynamicFields];
    const formData = { ...formDataFromRedux, ...extraFormData };
    const flattenedFormData = flattenObject(formData);

    // Sprawdzanie, czy wszystkie wymagane pola są wypełnione
    const allFilled = allRequiredFields.every((field) => {
      const value = flattenedFormData[field];
      return value !== undefined && value !== null && value.toString().trim() !== "";
    });

    if (!allFilled) {
      const newErrors = {};
      allRequiredFields.forEach((field) => {
        if (!flattenedFormData[field] || flattenedFormData[field].toString().trim() === "") {
          newErrors[field] = "To pole jest wymagane.";
        }
      });
      setErrors(newErrors);
      toast.error("Wypełnij wszystkie wymagane pola.");
      return; // Zatrzymaj dalsze przetwarzanie
    }

    // Jeśli wszystkie pola są wypełnione, kontynuuj
    setErrors({});
    toast.success("Wszystkie wymagane pola zostały wypełnione.");
    setIsLoading(true);

    try {
      // Wywołanie onSubmitOverride tylko po poprawnej walidacji
      if (onSubmitOverride) {
        await onSubmitOverride(e);
      }

      // Kontynuacja operacji w handleSubmit (np. zapis do Airtable)
      if (saveToAirtable) {
        try {
          await saveToAirtable(formData);
          //console.log("✅ Zapis do Airtable zakończony sukcesem.");
        } catch (error) {
          console.error("❌ Błąd podczas zapisu do Airtable:", error);
          toast.error("Wystąpił błąd przy zapisie do Airtable.");
          return;
        }
      }

      if (clearAction) dispatch(clearAction());
      toast.success(notificationMessage);

      // Wywołanie onSuccess po poprawnej walidacji i zapisaniu danych
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Wystąpił błąd przy wysyłaniu formularza.");
      console.error("❌ Błąd podczas wysyłania formularza:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form ref={ref} onSubmit={handleSubmit} className={className} {...props}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            key: child.key || child.props.name || index,
            error: errors[child.props.name],// Przekazanie błędu do FormField
          })
        }
        return child
      })}
      {!isStepForm && (
        <Button type="submit" variant={variant} disabled={isLoading} className={addToButton} padding={padding}>
          {isLoading ? "Wysyłanie..." : submitButtonText}
        </Button>
      )}
    </form>
  )
})
Form.propTypes = {
  children: PropTypes.node.isRequired,
  submitButtonText: PropTypes.string,
  notificationMessage: PropTypes.string,
  saveToAirtable: PropTypes.func,
  // onSubmit: PropTypes.func.isRequired,
}

export default Form
