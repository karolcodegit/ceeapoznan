import React from 'react'

const TopBar = ({children}) => {
  return (
    <div className='w-full h-72 bg-lighter'>
        <h1 className='mx-auto text-gray-200 text-5xl text-center font-bold py-10'>{children}</h1>
    </div>
  )
}

export default TopBar