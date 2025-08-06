import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { updateField as updateContactField } from '../../../store/contact/contactSlice';
import { updateField as updateRegisterField } from '../../../store/RegisterForm/formSlice'
import { updateDeliveryField } from '../../../store/delivery/deliverySlice';
import { updateField as updateUserCartField } from '../../../store/user/userSlice';
import { updateField as updateNotificationField } from '../../../store/notificationBook/notificationSlice';

const sliceMap = {
  formRegister: updateRegisterField,
  contact: updateContactField,
  userCart: updateUserCartField,
  delivery: updateDeliveryField,
  notificationBook: updateNotificationField,

};

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
    if (formSliceKey === "delivery" && name.startsWith("address.")) {
      const addressField = name.split(".")[1]; // Pobierz klucz, np. "street"
      return state.delivery.address?.[addressField] || "";
    }
    if (id && state[formSliceKey]?.books) {
      // Obsługa formularzy z `id` (np. notificationBook)
      return state[formSliceKey]?.books?.[id]?.[name] || "";
    }
    return state[formSliceKey]?.[name] || "";
  });

  const update = sliceMap[formSliceKey];


  const handleChange = (e) => {
    const newValue = e.target.value;
  
    // Wywołanie customowego onChange, jeśli istnieje
    if (customOnChange) {
      customOnChange(e);
    }
  
    // Wywołanie onChangeAction, jeśli istnieje
    if (onChangeAction) {
      onChangeAction({ field: name, value: newValue });
    }
  
    // Aktualizacja Redux
    if (formSliceKey === "delivery") {
      dispatch(updateDeliveryField({ field: name, value: newValue }));
    } else if (update) {
      if (id) {
        // Aktualizacja z `id` (np. notificationBook)
        dispatch(update({ id, field: name, value: newValue }));
      } else {
        // Aktualizacja bez `id` (np. formRegister, contact)
        dispatch(update({ field: name, value: newValue }));
      }
    } else {
      console.warn(`Nie znaleziono akcji dla formSliceKey: ${formSliceKey}`);
    }
  };

  const inputValue = customValue !== undefined ? customValue : value;

  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className={`block text-sm font-medium text-gray-700 dark:text-gray-200 ${margin ? margin : 'mt-7' }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
            error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
          } dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 h-64`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={`mt-1  block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
            error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
          } dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600`}
        />
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
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