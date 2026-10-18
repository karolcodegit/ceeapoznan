// components/Form.js — uniwersalny wrapper formularzy (walidacja + honeypot + submit)
// Zapis danych wyłącznie przez onSubmitOverride (Cloud Run → Supabase).
// Airtable usunięte całkowicie.
import React, { useRef, useState, useImperativeHandle } from "react"
import PropTypes from "prop-types"
import { useDispatch, useSelector, useStore } from "react-redux"
import { toast } from "sonner"
import Button from "../Button/Button"
import { selectDynamicState } from "../../utils/selectors"
import { flattenObject } from "../../utils/flattenObject"

const Form = React.forwardRef(({
  requireToken = false,
  prepareFormData,
  children,
  submitButtonText = "Wyślij",
  clearAction,
  notificationMessage = "Dziękujemy! Formularz został wysłany.",
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
  const formRef = useRef()
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const store = useStore() // świeży stan w momencie submita (bez stale closure)
  const [errors, setErrors] = useState({})
  const dynamicState = useSelector(selectDynamicState)

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      if (formRef.current) {
        handleSubmit({ preventDefault: () => {}, target: formRef.current })
      }
    },
  }))

  const handleSubmit = async e => {
    e.preventDefault()

    const formDataHTML = new FormData(e.target)

    // Antyspam: honeypot + fake pole + token JS
    if (formDataHTML.get("bot-field") || formDataHTML.get("website")) {
      console.warn("🚫 Spam wykryty (honeypot).")
      return
    }
    if (requireToken && !formDataHTML.get("token")) {
      console.warn("🚫 Spam wykryty (brak JS tokena).")
      return
    }

    const dynamicFields = typeof dynamicRequiredFields === "function"
      ? dynamicRequiredFields(dynamicState)
      : []
    const allRequiredFields = [...requiredFields, ...dynamicFields]

    const freshFormData = store.getState()[formSliceKey] || {}
    const formData = { ...freshFormData, ...extraFormData }
    const flattened = flattenObject(formData)

    const newErrors = {}
    allRequiredFields.forEach(field => {
      const value = flattened[field]
      if (value === undefined || value === null || value.toString().trim() === "") {
        newErrors[field] = "To pole jest wymagane."
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error("Wypełnij wszystkie wymagane pola.")
      return
    }

    setErrors({})
    setIsLoading(true)

    try {
      if (onSubmitOverride) {
        await onSubmitOverride(e) // ← jedyna ścieżka wysyłki (Cloud Run → Supabase)
      }

      if (clearAction) dispatch(clearAction())
      toast.success(notificationMessage)
      if (onSuccess) onSuccess()
    } catch (error) {
      toast.error(error?.message || "Wystąpił błąd przy wysyłaniu formularza.")
      console.error("❌ Błąd podczas wysyłania formularza:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={className} {...props}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            key: child.key || child.props.name || index,
            error: errors[child.props.name],
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
}

export default Form