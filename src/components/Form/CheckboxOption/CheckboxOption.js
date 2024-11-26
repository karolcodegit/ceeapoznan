import React, { useEffect, useState } from 'react'

export const CheckboxOption = ({ field, form, handleChange, formSubmitted, formErrors, resetFormState }) => {
  
  const additionalFee = field.name === 'option1' ? (field.price) : (field.name === 'option2' ? (field.price) : (field.name === 'option3' ? (field.price) : 0));
// eslint-disable-next-line no-unused-vars
  const [fieldValue, setFieldValue] = useState('');
  const validateField = () => {
    return !!form[field.name];
  };
  useEffect(() => {
    if (formSubmitted) {
      resetFormState();
      setFieldValue('');
    }
  }, [formSubmitted]);
  

  return (
    <div key={field.name}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        <input
          type="checkbox"
          name={field.name}
          checked={form[field.name]}
          onChange={(e) => handleChange(e, field.typ)}
          className="border rounded-md p-2 mr-3"
          aria-describedby={formErrors[field.name] && !validateField() ? `${field.name}-error` : null}
          disabled={field.disabled}
        />
        {field.label} ({additionalFee} PLN)
        {formErrors[field.name] && !validateField() ? ( <span className="text-red-500">{formErrors[field.name]}</span>) : null}
      </label>
    </div>
  );
};
