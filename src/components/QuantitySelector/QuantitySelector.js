import React, { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

const QuantitySelector = ({ min = 1, max = 20, initial = 1, onChange }) => {
  const [quantity, setQuantity] = useState(initial);

  const handleIncrement = () => {
    if (quantity < max) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onChange && onChange(newQuantity);
    }
  };

  const handleDecrement = () => {
    if (quantity > min) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onChange && onChange(newQuantity);
    }
  };

  const handleInputChange = (e) => {
    const value = Math.max(min, Math.min(max, Number(e.target.value) || min));
    setQuantity(value);
    onChange && onChange(value);
  };

  return (
    <div className="flex items-center space-x-4">
    <button
      className={`px-4 py-2 bg-gray-400 text-white rounded-full shadow-md hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed`}
      onClick={handleDecrement}
      disabled={quantity === min}
      title="Zmniejsz ilość"
    >
      <FaMinus size={16} />
    </button>
    <input
      type="number"
      value={quantity}
      onChange={handleInputChange}
      className="w-20 text-center text-xl font-semibold dark:text-gray-100 dark:bg-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none no-arrows"
      min={min}
      max={max}
      title="Ilość"
    />
    <button
      className={`px-4 py-2 bg-gray-400 text-white rounded-full shadow-md hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed`}
      onClick={handleIncrement}
      disabled={quantity === max}
      title="Zwiększ ilość"
    >
      <FaPlus size={16} />
    </button>
  </div>
  );
};

export default QuantitySelector;