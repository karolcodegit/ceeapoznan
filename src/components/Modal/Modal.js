import React from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

const Modal = ({isOpen, closeModal, children}) => {
  if (!isOpen) {
    return null;
  }
  return (
    <div className='bg-gray-200 rounded-3xl fixed top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 py-2 px-6 mx-auto max-w-5xl z-50 '>
      <div className="flex justify-end">
            <button onClick={closeModal} className="mb-4" aria-label="Close modal">
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        
        <div className='flex flex-col'>
            {children}
        </div>
    </div>
  )
}

export default Modal