import React from 'react'

const Label = ({name}) => {
  return (
    <label className='text-gray-900 dark:text-gray-200 leading-10 font-medium text-sm' htmlFor={name}>{name}</label>
  )
}

export default Label