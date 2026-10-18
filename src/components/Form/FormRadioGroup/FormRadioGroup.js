import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateField as updateRegisterField, setFormError } from "../../../store/RegisterForm/formSlice"
import { updateField as updateContactField } from "../../../store/contact/contactSlice"
import { updateField as updateNotificationField } from "../../../store/notificationBook/notificationSlice"
import { updateField as updateCheckoutField } from "../../../store/checkout/checkoutSlice"
import { selectFormErrors, selectFormSubmitted } from "../../../utils/selectors"

const sliceMap = {
  formRegister: updateRegisterField,
  contact: updateContactField,
  notificationBook: updateNotificationField,
  checkout: updateCheckoutField,
}

const PILL_BASE =
  "inline-flex cursor-pointer items-center gap-2.5 rounded-full border-2 px-5 py-2 text-sm font-medium select-none transition-colors duration-150"
const PILL_UNCHECKED =
  PILL_BASE +
  " border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50" +
  " dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-500"
const PILL_CHECKED =
  PILL_BASE +
  " border-indigo-600 bg-indigo-50 text-indigo-700" +
  " dark:border-indigo-400 dark:bg-indigo-900/30 dark:text-indigo-300"
const RADIO_INPUT = "h-4 w-4 shrink-0 cursor-pointer accent-indigo-600 dark:accent-indigo-400"

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
  const value = useSelector(state => state[formSliceKey]?.[name]) || ""
  const formErrors = useSelector(state => selectFormErrors(state, formSliceKey)) || {}
  const formSubmitted = useSelector(state => selectFormSubmitted(state, formSliceKey))
  const error = formErrors[name]
  const update = sliceMap[formSliceKey]

  const handleChange = e => {
    const newValue = e.target.value
    if (onChange) onChange(newValue)
    if (update) dispatch(update({ field: name, value: newValue }))
    if (formSubmitted && required && newValue === "") {
      dispatch(setFormError({ field: name, message: "To pole jest wymagane." }))
    }
  }

  return (
    <div className={`pb-4 ${className}`}>
      <p id={`${name}-label`} className="block text-sm font-medium text-gray-700 dark:text-gray-200 py-4">
        {label} {required && <span className="text-red-500">*</span>}
      </p>
      <div role="radiogroup" aria-labelledby={`${name}-label`} className="flex flex-wrap gap-2.5">
        {options.map(option => {
          const isChecked = value === option
          return (
            <label key={option} className={isChecked ? PILL_CHECKED : PILL_UNCHECKED}>
              <input
                type="radio"
                name={name}
                value={option}
                checked={isChecked}
                onChange={handleChange}
                required={required}
                className={RADIO_INPUT}
              />
              {option}
            </label>
          )
        })}
      </div>
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  )
}

export default FormRadioGroup
