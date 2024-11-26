import React from 'react'

const Paragraph = ({ children, firstLetter = false, margin = true, className = '' }) => {
  // Klasy dla stylizacji pierwszej litery
  const firstLetterStyles = firstLetter
    ? 'first-letter:text-7xl first-letter:font-bold first-letter:mr-4 first-letter:float-left first-letter:text-light'
    : '';

  // Klasy dla marginesów
  const marginStyles = margin ? 'py-8' : 'py-1';

  return (
    <p
      className={`${firstLetterStyles} ${marginStyles} text-base max-md:text-sm leading-7 text-gray-800 dark:text-gray-300 ${className}`}
    >
      {children}
    </p>
  );
};

export default Paragraph