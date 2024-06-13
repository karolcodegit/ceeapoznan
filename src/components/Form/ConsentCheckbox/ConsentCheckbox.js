import React, { useEffect, useState } from 'react'

export const ConsentCheckbox = ({ field, form, checked, handleChange,resetFormState, formSubmitted, formErrors }) => {
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
  }, [formSubmitted, resetFormState]);
  return (
    <div className="mt-2 space-y-2">
        <div>
        <label htmlFor={field.name} className="inline-flex items-center first-letter pl-4 dark:text-gray-200">
        <input
            type="checkbox"
            className="form-checkbox mr-3"
            name={field.name}
            checked={checked}
            onChange={handleChange}
        />
        
            {field.label}
        </label>
        {formErrors[field.name] && !validateField() ? ( <p className="text-sm text-red-500 mt-1">{formErrors[field.name]}</p>) : null}
        </div>
    </div>
  )
}
