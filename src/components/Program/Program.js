import React from 'react'
import Title from '../Title/Title'

const program_kursu = [
    {
        data: '4.10.2023',
        waznaWydarzenie:  'Rejestracja uczestników kursu CEEA 13:00-14:45'
        
    }
]

const Program = ({data}) => {
  return (
    <>
    <Title tag='h4'>Program kursu</Title>
    <Title tag='h5'>Dzień pierwszy {data}</Title>
  
    </>
  )
}

export default Program