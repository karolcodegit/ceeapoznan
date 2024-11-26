import React, { useEffect, useState } from 'react'

export const FormList = ({
  field,
  form,
  handleChange,
  formSubmitted,
  formErrors
}) => {
  const [fieldValue, setFieldValue] = useState('');

  // Funkcja walidacji, sprawdzająca, czy pole zostało wypełnione
  const validateField = () => {
    return !!form[field.name] && form[field.name] !== 'Proszę wybrać dania';
  };

  // Hook do resetowania wartości po wysłaniu formularza
  useEffect(() => {
    if (formSubmitted) {
      setFieldValue(''); // Resetowanie wartości po wysłaniu formularza
    }
  }, [formSubmitted]);

  return (
    <div className="space-y-4">
      {/* Etykieta formularza */}
      <label
        htmlFor={field.name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {field.label}
        {/* Dodanie gwiazdki przy wymaganych polach po wysłaniu formularza */}
        {formSubmitted && form[field.name] === 'Proszę wybrać dania' && (
          <span className="text-red-500">*</span>
        )}
      </label>

      {/* Pole formularza - Select */}
      <select
        id={field.name}
        name={field.name}
        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
        value={form[field.name]}
        onChange={handleChange}
      >
        {field.options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>

      {/* Komunikat o błędzie */}
      {formErrors[field.name] && !validateField() && (
        <p className="text-sm text-red-500 mt-1">{formErrors[field.name]}</p>
      )}
    </div>
  );
};


                