import React, { useEffect, useState } from 'react'

// Wersja „Edge-safe": widoczny natywny checkbox (accent-indigo),
// bez klasy form-checkbox (wymaga pluginu i potrafi różnie wyglądać w przeglądarkach).
export const ConsentCheckbox = ({ name, label, checked, onChange, required }) => {
  return (
    <div className="mt-4">
      <label
        htmlFor={name}
        className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 -mx-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60"
      >
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          required={required}
          className="
            mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-md
            border-gray-300 accent-indigo-600
            focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0
            dark:border-gray-600 dark:accent-indigo-400
          "
        />
        <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-200">
          {label}
        </span>
      </label>
    </div>
  )
}