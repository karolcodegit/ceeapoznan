import React from "react"
import { Link } from "gatsby"

const Button = ({ children, href, className = '', ...props }) => {
  return (
    <>
      {href ? (
        <Link
          to={href}
          target="_blank"
          className={`grow-1 text-white text-sm font-semibold leading-6 py-4 px-8 rounded-md transition-all duration-300 ease-in-out shadow-lg hover:shadow-2xl 
            bg-vividTurquoise hover:bg-[#F6BCBA] 
            dark:bg-gradient-to-r dark:from-blue dark:to-navyBlue 
            dark:hover:bg-gradient-to-r dark:hover:from-[#444] dark:hover:via-[#333] dark:hover:to-[#222] 
            dark:text-white ${className}`}
          rel="noopener noreferrer"
        >
          {children}
        </Link>
      ) : (
        <button
          className={`grow-1 text-white text-sm font-semibold leading-6 py-4 px-8 rounded-md transition-all duration-300 ease-in-out shadow-lg hover:shadow-2xl 
            bg-[#C8A8E9] hover:bg-[#F6BCBA] 
            dark:bg-gradient-to-r dark:from-blue dark:to-navyBlue 
            dark:hover:bg-gradient-to-r dark:hover:from-[#444] dark:hover:via-[#333] dark:hover:to-[#222] 
            dark:text-white ${className}`}
          {...props}
        >
          {children}
        </button>
      )}
    </>
  );
};

export default Button
