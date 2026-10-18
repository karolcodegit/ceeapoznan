import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { updateField, setFormError } from "../../../store/RegisterForm/formSlice"

// Select jednolity ze zwykłymi inputami we wszystkich przeglądarkach:
// appearance-none ukrywa natywną kontrolkę, własna strzałka SVG zastępuje ją wszędzie.
export const FormList = ({
  name,
  label,
  options,
  placeholder = "Wybierz",
  formSliceKey = "formRegister",
  required = false,
}) => {
  const dispatch = useDispatch()
  const value = useSelector(state => state[formSliceKey]?.[name] || "")
  const formErrors = useSelector(state => state[formSliceKey]?.formErrors || {})
  const formSubmitted = useSelector(state => state[formSliceKey]?.formSubmitted)

  const error = formErrors?.[name]
  const isEmpty = value === "" || value === placeholder

  const handleChange = e => {
    const newValue = e.target.value
    dispatch(updateField({ field: name, value: newValue }))

    if (formSubmitted && required) {
      if (newValue === "" || newValue === placeholder) {
        dispatch(setFormError({ field: name, message: "To pole jest wymagane." }))
      } else {
        dispatch(setFormError({ field: name, message: "" }))
      }
    }
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mt-7"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" title="Pole wymagane">*</span>
        )}
      </label>

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`
            appearance-none block w-full rounded-xl px-4 py-3 pr-11
            border-2 bg-white shadow-sm transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-indigo-400
            dark:bg-gray-800 dark:text-gray-100
            ${error
              ? "border-red-400 focus:border-red-500 dark:border-red-500/60"
              : "border-gray-200 hover:border-gray-300 focus:border-indigo-500 dark:border-gray-600 dark:hover:border-gray-500"}
            ${isEmpty ? "text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-gray-100"}
          `}
        >
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>

        {/* Strzałka – identyczna we wszystkich przeglądarkach */}
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
        >
          <path d="m6 8 4 4 4-4" />
        </svg>
      </div>

      {error && (
        <p id={`${name}-error`} role="alert" className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  )
}