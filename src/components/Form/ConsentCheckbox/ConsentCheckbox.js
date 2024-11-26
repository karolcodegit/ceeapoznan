import React, { useEffect, useState } from 'react'

export const ConsentCheckbox = ({
  field,
  form,
  checked,
  handleChange,
  resetFormState,
  formSubmitted,
  formErrors
}) => {
  const [fieldValue, setFieldValue] = useState('');

  // Funkcja walidacji
  const validateField = () => {
    return !!form[field.name];
  };

  // Hook do resetowania wartości po wysłaniu formularza
  useEffect(() => {
    if (formSubmitted) {
      setFieldValue('');
      resetFormState();
    }
  }, [formSubmitted]);

  return (
    <div className="mt-4 space-y-2">
      <div>
        {/* Etykieta z checkboxem */}
        <label
          htmlFor={field.name}
          className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          <input
            type="checkbox"
            id={field.name}  // Dodanie id do checkboxa dla dostępności
            className="form-checkbox mr-3 text-indigo-600 focus:ring-indigo-500 dark:text-indigo-400 dark:focus:ring-indigo-300"
            name={field.name}
            checked={checked}
            onChange={handleChange}
          />
          {field.label}
        </label>
        
        {/* Komunikat o błędzie */}
        {formErrors[field.name] && !validateField() && (
          <p className="text-sm text-red-500 mt-1">{formErrors[field.name]}</p>
        )}
      </div>
    </div>
  );
};