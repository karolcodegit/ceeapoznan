import React, { useEffect, useState } from 'react'

export const FormRadioGroup = ({ field, form, handleChange, formSubmitted, formErrors }) => {
  // eslint-disable-next-line no-unused-vars
  const [fieldValue, setFieldValue] = useState('');
  const validateField = () => {
    return !!form[field.name];
  };

  useEffect(() => {
    if (formSubmitted) {
      // resetFormState();
      setFieldValue('');
    }
  }, [formSubmitted]);
  

  return (
    <div>
      <span className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        {field.label}
        
      </span>
      <div className="mt-2" role="radiogroup" aria-labelledby="group_label">
        {field.options.map((option) => (
          <label key={option} className="inline-flex items-center mx-2">
            <input
              type="radio"
              className="form-radio"
              name={field.name}
              value={option}
              checked={form[field.name] === option}
              onChange={(e) => handleChange(e, field.typ)} // Dodaj e i typ pola jako argumenty
            />
            <span className="ml-2 dark:text-gray-200">{option}</span>
          </label>
        ))}
      </div>
      {formErrors[field.name] && !validateField() ? ( <p className="text-sm text-red-500 mt-1">{formErrors[field.name]}</p>) : null}
    </div>
  );
};
