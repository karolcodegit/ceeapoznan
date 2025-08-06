import React from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  updateField,
  setFormError,
} from "../../../store/RegisterForm/formSlice"

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

  const isValid = value !== "" && value !== undefined && value !== null

  const handleChange = e => {
    const newValue = e.target.value
    dispatch(updateField({ field: name, value: newValue }))

    if (
      formSubmitted &&
      required &&
      (newValue === "" || newValue === placeholder)
    ) {
      dispatch(setFormError({ field: name, message: "To pole jest wymagane." }))
    }
  }

  return (
    <div className="space-y-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mt-7"
      >
        {label}
        {required && <span className="text-red-500 ml-1" title="Pole wymagane">*</span>}
      </label>

      <select
        id={name}
        name={name}
        className={`mt-1 block w-full p-3 border ${
          formErrors[name] ? "border-red-500" : "border-gray-300"
        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600`}
        value={value}
        onChange={handleChange}
        required={required}
      >
        <option value="">{placeholder}</option> {/* <= WAŻNE! */}
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>

      {formErrors[name] && (
        <p className="text-sm text-red-500 mt-1">{formErrors[name]}</p>
      )}
    </div>
  )
}
