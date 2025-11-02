import React from 'react'

const Paragraph = ({
  children,
  firstLetter = false,
  margin = true,
  className = '',
  as = 'p',
}) => {
  const Tag = as;
  const firstLetterStyles = firstLetter
    ? 'first-letter:text-7xl first-letter:font-bold first-letter:mr-4 first-letter:float-left first-letter:text-light'
    : '';
  
  // Użyj marginesu zamiast paddingu — wizualnie lepiej działa w kontekście bloków
  const marginStyles = margin ? 'my-8' : 'my-1';

  return (
    <Tag
      className={`${firstLetterStyles} ${marginStyles} text-base max-md:text-sm leading-7 text-gray-800 dark:text-gray-300 ${className}`}
    >
      {children}
    </Tag>
  );
};
export default Paragraph