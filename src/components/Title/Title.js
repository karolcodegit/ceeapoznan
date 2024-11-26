import React from 'react'

const Title = ({ 
  tag: Tag = 'h3',
  children, 
  white = false, 
  padding = false, 
  className = '' 
}) => {
  // Kolory oparte na prop 'white'
  const titleClass = white 
    ? 'text-white dark:text-gray-100' 
    : 'text-[#213A58] dark:text-gray-300';

  // Padding zgodny z najlepszymi praktykami
  const addPadding = padding ? 'py-4 px-4' : '';

  // Style typograficzne dla każdego tytułu
  const typographyStyles = {
    h1: 'text-5xl max-lg:text-4xl max-md:text-3xl font-extrabold',
    h2: 'text-4xl max-lg:text-3xl max-md:text-2xl font-bold',
    h3: 'text-3xl max-md:text-2xl font-semibold',
    h4: 'text-2xl font-semibold',
    h5: 'text-xl',
    h6: 'text-lg font-medium',
    default: 'text-xl font-medium',
  };

  // Wybór odpowiednich stylów
  const currentTypography = typographyStyles[Tag] || typographyStyles.default;

  // Końcowy render komponentu
  return (
    <Tag 
      className={`${titleClass} ${addPadding} ${currentTypography} ${className} transition-all duration-200 ease-in-out`}
    >
      {children}
    </Tag>
  );
};
export default Title