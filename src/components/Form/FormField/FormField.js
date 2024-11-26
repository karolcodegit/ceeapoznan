import React, { useEffect, useState } from 'react'

export const FormField = ({
  field,
  form,
  handleChange,
  formSubmitted,
  formErrors,
  pattern,
}) => {
  const [fieldValue, setFieldValue] = useState(form[field.name] || ''); // Synchronizowanie wartości z formularzem

  // Synchronizacja lokalnego stanu z globalnym stanem `form`
  useEffect(() => {
    setFieldValue(form[field.name] || '');
  }, [form[field.name]]);

  // Funkcja walidacji
  const validateField = () => {
    return form[field.name] !== '' && form[field.name] !== undefined;
  };

  // Funkcja obsługująca zmianę wartości pola
  const handleFieldChange = (e) => {
    setFieldValue(e.target.value);
    handleChange(e); // Przekazujemy zmiany do głównego formularza
  };

  return (
    <div className="space-y-4">
      <label
        htmlFor={field.name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {field.label}
        {field.required && formSubmitted && !validateField() && (
          <span className="text-red-500">*</span>
        )}
      </label>

      {field.type === 'textarea' ? (
        <textarea
          id={field.name}
          name={field.name}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
          value={fieldValue}
          onChange={handleFieldChange}
        />
      ) : (
        <input
          id={field.name}
          name={field.name}
          type={field.type}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
          value={fieldValue}
          onChange={handleFieldChange}
          pattern={pattern}
        />
      )}

      {formErrors?.[field.name] && !validateField() && (
        <p className="text-sm text-red-500 mt-1">{formErrors[field.name]}</p>
      )}
    </div>
  );
};