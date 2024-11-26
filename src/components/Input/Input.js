import React from 'react'
import PropTypes from 'prop-types'

const Input = ({tag, name, maxLength = 150, label, ...props}) => {
    const Tag = tag || 'input';
    return (
      <>
          <Tag 
              name={name}
              id={name}
              maxLength={maxLength}
              placeholder=" "
              className={Tag !== 'textarea' ? 
                  'text-gray-900 border rounded-md border-gray-400 leading-3 text-sm ring-inset shadow-black  ring-offset-0 drop-shadow py-2 px-4' 
                  :
                  'text-gray-900 border rounded-md border-gray-400 leading-3 text-sm ring-inset shadow-black ring-offset-0 drop-shadow py-2 px-4 h-52 '} 
              {...props}
          />
      </>
    )
  }
  
  Input.propTypes = {
      tag: PropTypes.string,
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
      maxLength: PropTypes.number,
  }

export default Input