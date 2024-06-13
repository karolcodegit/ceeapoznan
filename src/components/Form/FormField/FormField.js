import React, { useEffect, useState } from 'react'

export const FormField = ({ field, form, handleChange,formSubmitted, formErrors }) => {
  // eslint-disable-next-line no-unused-vars
  const [fieldValue, setFieldValue] = useState('');
  const isTextarea = field.type === 'textarea';
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
      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-100">
        {field.label} {field.required && formSubmitted && !form[field.name] && <span className="text-red-500">*</span>}
        {isTextarea ? (
          <textarea
            name={field.name}
            className='mt-1 block w-full p-2 border border-gray-300 rounded-md h-52 dark:text-gray-800'
            value={form[field.name]}
            onChange={handleChange}
            maxLength={field.maxLength}
          />
        ) : (
          <input
            name={field.name}
            type={field.type}
            className='mt-1 block w-full p-2 border border-gray-300 rounded-md dark:text-gray-800'
            value={form[field.name]}
            onChange={handleChange}
          />
        )}
      </label>
      {formErrors[field.name] && !validateField() ? (
        <p className="text-sm text-red-500 mt-1">{formErrors[field.name]}</p>
      ) : null}

    </div>
  );
};