// components/Form.js
import React, { useRef, useState, useImperativeHandle } from "react"
import PropTypes from "prop-types"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import Button from "../Button/Button"
import { selectDynamicState } from "../../utils/selectors"
import { flattenObject } from "../../utils/flattenObject"

const Form = React.forwardRef(({
  requireToken = false,
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
  const formRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const formDataFromRedux = useSelector(state => state[formSliceKey] || {}); // Wywołanie useSelector na najwyższym poziomie
  const [errors, setErrors] = useState({});
  const dynamicState = useSelector(selectDynamicState);
  
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      if (formRef.current) {
        handleSubmit({ 
          preventDefault: () => {}, 
          target: formRef.current 
        });
      }
    },
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Pobierz dane formularza
    const formEl = e.target;
    const formDataHTML = new FormData(formEl);
  
    // 🛑 1. Sprawdzenie honeypota Netlify
    if (formDataHTML.get("bot-field")) {
      console.warn("🚫 Spam wykryty (bot-field wypełniony).");
      return;
    }
  
    // 🛑 2. Fake pole — boty często wypełniają wszystko
    if (formDataHTML.get("website")) {
      console.warn("🚫 Spam wykryty (fake field 'website').");
      return;
    }
  
    // 🛑 3. Token JS — prosty test, czy formularz był renderowany po stronie użytkownika
    if (requireToken && !formDataHTML.get("token")) {
      console.warn("🚫 Spam wykryty (brak JS tokena).");
      return;
    }
  
    // Obsługa dynamicRequiredFields
    const dynamicFields = typeof dynamicRequiredFields === "function"
      ? dynamicRequiredFields(dynamicState)
      : [];
    const allRequiredFields = [...requiredFields, ...dynamicFields];
    const formData = { ...formDataFromRedux, ...extraFormData };
    const flattenedFormData = flattenObject(formData);
  
    // Sprawdzenie czy wszystkie pola są wypełnione
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
      return;
    }
  
    // Jeśli wszystko OK
    setErrors({});
    toast.success("Wszystkie wymagane pola zostały wypełnione.");
    setIsLoading(true);
  
    try {
      // Wywołanie onSubmitOverride po walidacji
      if (onSubmitOverride) {
        await onSubmitOverride(e);
      }
  
      // Zapis do Airtable (jeśli włączony)
      if (saveToAirtable) {
        try {
          await saveToAirtable(formData);
        } catch (error) {
          console.error("❌ Błąd przy zapisie do Airtable:", error);
          toast.error("Wystąpił błąd przy zapisie do Airtable.");
          return;
        }
      }
  
      if (clearAction) dispatch(clearAction());
      toast.success(notificationMessage);
  
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
    <form ref={formRef} onSubmit={handleSubmit} className={className} {...props}>
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
