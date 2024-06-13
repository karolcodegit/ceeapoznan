import React from 'react'
import CheckboxOption from '../CheckboxOption/CheckboxOption'

const AdditionalFees = ({ fees, form, handleChange }) => {
  return (
    <div>
      
      <div className="mt-2 space-y-2">
        {fees.map((fee) => (
          <CheckboxOption
            key={fee.name}
            name={fee.name}
            checked={form[fee.name]}
            onChange={handleChange}
            label={`${fee.label}: ${fee.price} PLN`}
          />
        ))}
      </div>
    </div>
  )
}

export default AdditionalFees