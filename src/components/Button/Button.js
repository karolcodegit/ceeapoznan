import React from 'react'
import { Link } from 'gatsby'

const Button = ({children, href, ...props}) => {
  return (
    <>
      {
        href ? (
          <Link
  to={href}
  target="_blank"
  className="grow-1 text-sm font-bold leading-6 text-white py-3 px-5 rounded-lg bg-[#3a506b] hover:bg-[#283a46] transition-colors duration-200 ease-in-out shadow-md hover:shadow-lg"
  rel="noopener noreferrer"
>
  {children}
</Link>
          ) : (
              <button className="grow-1 text-sm font-bold leading-6 text-white py-3 px-5 rounded-lg bg-[#3a506b] hover:bg-[#283a46] transition-colors duration-200 ease-in-out shadow-md hover:shadow-lg" {...props}>
                {children}
              </button>
          )
      }
    </>
  )
}

export default Button