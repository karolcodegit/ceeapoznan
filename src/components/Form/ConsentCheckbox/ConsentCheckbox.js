import React, { useEffect, useState } from 'react'

export const ConsentCheckbox = ({ name, label, checked, onChange, required }) => {
  return (
    <div className="mt-4 space-y-2">
      <label htmlFor={name} className="inline-flex items-center text-sm text-gray-700 dark:text-gray-200">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          className="form-checkbox mr-3 text-indigo-600 focus:ring-indigo-500 dark:text-indigo-400 dark:focus:ring-indigo-300"
          required={required}
        />
        {label}
      </label>
    </div>
  )
}