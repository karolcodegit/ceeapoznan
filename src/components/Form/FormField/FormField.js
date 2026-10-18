import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { updateField as updateRegisterField } from '../../../store/RegisterForm/formSlice'
import { updateField as updateContactField } from '../../../store/contact/contactSlice';
import { updateField as updateNotificationField } from '../../../store/notificationBook/notificationSlice';
import { updateField as updateCheckoutField } from '../../../store/checkout/checkoutSlice';

const sliceMap = {
  formRegister: updateRegisterField,
  contact: updateContactField,
  notificationBook: updateNotificationField,
  checkout: updateCheckoutField,   // ← obsługuje też ścieżki "address.street"
};

// Wersja „Edge-safe": widoczne natywne inputy, bez sr-only / peer-* / animowanych cieni.
const INPUT_BASE =
  'block w-full rounded-xl border-2 bg-white px-4 py-3 shadow-sm transition-colors duration-150 ' +
  'focus:outline-none focus:ring-2 focus:ring-indigo-400 ' +
  'dark:bg-gray-800 dark:text-gray-100';
const INPUT_ERROR =
  'border-red-400 focus:border-red-500 dark:border-red-500/60';
const INPUT_NORMAL =
  'border-gray-200 hover:border-gray-300 focus:border-indigo-500 dark:border-gray-600 dark:hover:border-gray-500';

const FormField = ({
  name,
  label,
  type = 'text',
  required,
  placeholder,
  error,
  formSliceKey = 'formRegister',
  value: customValue,
  onChange: customOnChange,
  onChangeAction = null,
  margin,
  id,
}) => {
  const dispatch = useDispatch();
  const value = useSelector((state) => {
    if (id && state[formSliceKey]?.books) {
      return state[formSliceKey]?.books?.[id]?.[name] || "";
    }
    const slice = state[formSliceKey] || {};
    return name.split(".").reduce((acc, key) => acc?.[key], slice) ?? "";
  });

  const update = sliceMap[formSliceKey];

  const handleChange = (e) => {
    const newValue = e.target.value;

    if (customOnChange) customOnChange(e);
    if (onChangeAction) onChangeAction({ field: name, value: newValue });

    if (update) {
      if (id) dispatch(update({ id, field: name, value: newValue }));
      else dispatch(update({ field: name, value: newValue }));
    } else {
      console.warn(`Nie znaleziono akcji dla formSliceKey: ${formSliceKey}`);
    }
  };

  const inputValue = customValue !== undefined ? customValue : value;
  const inputClass = `${INPUT_BASE} ${error ? INPUT_ERROR : INPUT_NORMAL}`;

  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className={`block text-sm font-medium text-gray-700 dark:text-gray-200 ${margin ? margin : 'mt-7'}`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={name} name={name} value={inputValue} onChange={handleChange}
          placeholder={placeholder} aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`${inputClass} h-64`}
        />
      ) : (
        <input
          id={name} name={name} type={type} value={inputValue} onChange={handleChange}
          placeholder={placeholder} aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={inputClass}
        />
      )}

      {error && (
        <p id={`${name}-error`} role="alert" className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

FormField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  formSliceKey: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
};

export default FormField;