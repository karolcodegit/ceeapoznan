import React from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"

const Modal = ({ isOpen, closeModal, children }) => {
  if (!isOpen) {
    return null
  }
  return (
    <div className='bg-white shadow-2xl rounded-3xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-5 px-6 mx-auto min-w-96 z-50'>
    <div className="relative w-full">
      <button onClick={closeModal} className="absolute top-2 right-2" aria-label="Close modal">
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
