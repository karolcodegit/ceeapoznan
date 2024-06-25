import React from 'react'

const Paragraph = ({children, firstLetter, margin }) => {
    const letter = firstLetter ? 'first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-light' : null;
    const noMargin = margin ? 'py-1' : 'py-5';
  return (
    <p className={`${letter} ${noMargin}  text-base max-md:text-sm leading-7 text-gray-800 dark:text-gray-300`}>{children}</p>
  )
}

export default Paragraph