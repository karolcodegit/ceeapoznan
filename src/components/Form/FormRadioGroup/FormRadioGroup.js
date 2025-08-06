import React from 'react'

import { useDispatch, useSelector } from "react-redux"
import { updateField, setFormError } from "../../../store/RegisterForm/formSlice"
import { updateDeliveryField } from '../../../store/delivery/deliverySlice'
import { selectFormErrors, selectFormSubmitted } from '../../../utils/selectors'

const FormRadioGroup = ({
  name,
  label,
  options = [],
  required = false,
  formSliceKey = "formRegister",
  onChange,
  className = "",
}) => {
  const dispatch = useDispatch()
  const value = useSelector((state) => state[formSliceKey]?.[name] || "")
  const formErrors = useSelector((state) => selectFormErrors(state, formSliceKey));
  const formSubmitted = useSelector((state) => selectFormSubmitted(state, formSliceKey));

  
  const handleChange = (e) => {
    const newValue = e.target.value


    // Wywołaj przekazane onChange, jeśli istnieje
    if (onChange) {
      onChange(newValue);
    }

    // wybierz właściwą akcję
    if (formSliceKey === "delivery") {
      dispatch(updateDeliveryField({ field: name, value: newValue }))
    } else {
      dispatch(updateField({ field: name, value: newValue }))
    }

    if (formSubmitted && required && newValue === "") {
      dispatch(setFormError({ field: name, message: "To pole jest wymagane." }))
    }
  }

  return (
    <div className={`pb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 py-4">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-2" role="radiogroup" aria-labelledby={`${name}-label`}>
        {options.map((option) => (
          <label key={option} className="inline-flex items-center mr-6">
            <input
              type="radio"
              className="form-radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={handleChange}
              required={required}
            />
            <span className="ml-2 dark:text-gray-200">{option}</span>
          </label>
        ))}
      </div>

      {formErrors[name] && (
        <p className="text-sm text-red-500 mt-1">{formErrors[name]}</p>
      )}
    </div>
  )
}

export default FormRadioGroup