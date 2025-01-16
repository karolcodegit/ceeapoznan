import React from "react"
import { Link } from "gatsby"
import { Tooltip } from "react-tooltip"

const Button = ({
  children,
  href,
  className = "",
  DeliveryInfoButton,
  tooltip,
  tooltipId,
  ...props
}) => {
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
        <>
        <button
          className={`grow-1 text-white text-sm font-semibold leading-6 rounded-md transition-all duration-300 ease-in-out shadow-lg hover:shadow-2xl
             ${className} ${
            DeliveryInfoButton
              ? "px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white mx-auto w-full"
              : "py-4 px-8 bg-[#C8A8E9] hover:bg-[#F6BCBA] dark:bg-gradient-to-r dark:from-blue dark:to-navyBlue dark:hover:bg-gradient-to-r dark:hover:from-[#444] dark:hover:via-[#333] dark:hover:to-[#222] dark:text-white"
          }`}
          data-tooltip-id={tooltipId || ''}
            data-tooltip-place="bottom"
          {...props}
        >
          {children}
        </button>
        {tooltip && (
          <Tooltip
            id={tooltipId || 'default-tooltip-id'}
            style={{
              position: 'fixed',
              zIndex: 999,
            }}
          >
            <div className="flex flex-col gap-1 text-xs z-50">
              {tooltip.map((line, index) => (
                <span key={index}>{line}</span>
              ))}
            </div>
          </Tooltip>
        )}
        </>
      )}
    </>
  )
}

export default Button
