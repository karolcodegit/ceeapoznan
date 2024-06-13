import React from 'react'
import Title from '../Title/Title'
import Pracownik1 from '../../assets/images/pracownik.jpg'

const Employee = ({name, degree}) => {
  return (
    <div className='flex flex-col w-full justify-center'>
        <div className='pb-5 w-full'>
            <img className="rounded-3xl max-sm:w-full" src={Pracownik1} alt="Pracownik" />
        </div>
        <div>
            <Title tag='h5'>{name}</Title>
            <span className='text-sm font-light'>{degree}</span>
        </div>
    </div>
  )
}

export default Employee