import React, { useEffect, useState } from 'react'

  export const FormList = ({ field, form, handleChange, formSubmitted, formErrors }) => {
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
        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {field.label} {formSubmitted && form[field.name] === "Proszę wybrać dania" && <span className="text-red-500">*</span>}
          <select
            id={field.name}
            name={field.name}
            className='mt-1 block w-full p-2 border border-gray-300 rounded-md dark:text-gray-900'
            value={form[field.name]}
            onChange={handleChange}
          >
            {field.options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        {formErrors[field.name] && !validateField() ? ( <p className="text-sm text-red-500 mt-1">{formErrors[field.name]}</p>) : null}
      </div>
    );
  };


                