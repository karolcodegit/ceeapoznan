import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateField } from "../../../store/RegisterForm/formSlice"

/**
 * CheckboxOption – wersja „Edge-safe": widoczny natywny checkbox
 * (poprzedni wzorzec sr-only + peer powodował biały ekran w Edge).
 */
export const CheckboxOption = ({
  label,
  name,
  formSliceKey = "formRegister",
  disabled = false,
}) => {
  const dispatch = useDispatch()
  const checked = useSelector(state => state[formSliceKey]?.[name] || false)

  const handleChange = e => {
    dispatch(updateField({ field: name, value: e.target.checked }))
  }

  return (
    <div
      className={`
        flex items-start gap-3 rounded-xl px-3 py-2.5 -mx-3 transition-colors
        ${disabled ? "opacity-60" : "hover:bg-gray-50 dark:hover:bg-gray-800/60"}
      `}
    >
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className="
          mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-md
          border-gray-300 accent-indigo-600
          focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0
          disabled:cursor-not-allowed
          dark:border-gray-600 dark:accent-indigo-400
        "
      />
      <label
        htmlFor={name}
        className={`text-sm leading-relaxed ${
          disabled
            ? "cursor-not-allowed text-gray-400 dark:text-gray-500"
            : "cursor-pointer text-gray-800 dark:text-gray-200"
        }`}
      >
        {label}
      </label>
    </div>
  )
}