import React from 'react'

const Title = ({ tag: Tag, children, white, padding }) => {
  // Initialize titleClass based on the 'white' prop
  const titleClass = white ? 'text-gray-100' : 'text-dark';

  // Add padding if 'padding' prop is true, otherwise, use an empty string
  const addPadding = padding ? 'py-3' : '';

  // Return the appropriate heading element based on the 'Tag' prop
  switch (Tag) {
    case 'h1':
      return (
        <Tag className={`${titleClass} ${addPadding} text-5xl max-lg:text-4xl max-md:text-3xl font-bold dark:text-gray-300`}>
          {children}
        </Tag>
      );
    case 'h2':
      return (
        <Tag className={`${titleClass} ${addPadding} text-4xl max-lg:text-3xl max-md:text-2xl font-bold dark:text-gray-300`}>
          {children}
        </Tag>
      );
    case 'h3':
      return (
        <Tag className={`${titleClass} ${addPadding} text-3xl max-md:text-2xl font-bold dark:text-gray-300`}>
          {children}
        </Tag>
      );
    case 'h4':
      return (
        <Tag className={`${titleClass} ${addPadding} text-2xl font-bold dark:text-gray-300`}>
          {children}
        </Tag>
      );
    case 'h5':
      return (
        <Tag className={`${titleClass} ${addPadding} text-xl font-bold dark:text-gray-300`}>
          {children}
        </Tag>
      );
    case 'h6':
      return (
        <Tag className={`${titleClass} ${addPadding} text-lg font-bold dark:text-gray-300`}>
          {children}
        </Tag>
      );
    default:
      return (
        <Tag className={`${titleClass} ${addPadding} text-xl font-bold dark:text-gray-300`}>
          {children}
        </Tag>
      );
  }
};
export default Title