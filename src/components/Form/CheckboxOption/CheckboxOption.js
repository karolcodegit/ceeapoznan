import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateField } from "../../../store/RegisterForm/formSlice"

export const CheckboxOption = ({ label, name, formSliceKey = "formRegister", disabled = false }) => {
  const dispatch = useDispatch()
  const checked = useSelector(state => state[formSliceKey]?.[name] || false)

  const handleChange = e => {
    dispatch(updateField({ field: name, value: e.target.checked }))
  }

  return (
    <div className="flex items-center gap-3 py-2">
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
      />
      <label
        htmlFor={name}
        className={`text-sm ${
          disabled ? "text-gray-400 dark:text-gray-500" : "text-gray-800 dark:text-gray-200"
        }`}
      >
        {label}
      </label>
    </div>
  )
}