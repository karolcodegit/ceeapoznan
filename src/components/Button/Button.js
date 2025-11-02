import React, { useEffect } from "react"
import * as Sentry from "@sentry/react";
import { Link } from "gatsby"
import { Tooltip } from "react-tooltip"

const Button = ({
  children,
  href,
  className = 'default',
  variant,
  tooltip,
  tooltipId,
  onClick,
  padding = 'py-4',
  margines = 'mt-6',
  disabled = false, // Domyślnie przycisk nie jest zablokowany
  isLoading = false, // Dodano obsługę stanu ładowania
  ...props
}) => {
  const handleClick = e => {
    if (props.type === "button" && onClick) {
      e.preventDefault() // Zapobiegamy domyślnemu zachowaniu tylko dla typu "button"
    }
    if (onClick) {
      onClick(e)
    } 
  }

  

  const variantClasses = {
    submit: `
    bg-gradient-to-r from-vividTurquoise to-deepTurquoise text-white 
    hover:from-deepTurquoise hover:to-vividTurquoise 
    shadow-md hover:shadow-lg 
    dark:from-[#3fa7d6] dark:to-[#257ca3] 
    dark:hover:from-[#257ca3] dark:hover:to-[#3fa7d6] 
    dark:shadow-[#1e293b]/60
  `,
  back: `
    bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900 
    hover:from-gray-400 hover:to-gray-500 shadow-md hover:shadow-lg 
    dark:from-slate-600 dark:to-slate-700 dark:text-gray-200
    dark:hover:from-slate-700 dark:hover:to-slate-800 dark:shadow-black/50
  `,
  next: `
    bg-gradient-to-r from-lightMint to-pastelTurquoise text-green-800 
    hover:from-pastelTurquoise hover:to-lightMint shadow-md hover:shadow-lg 
    dark:from-[#3ba37d] dark:to-[#4fc89a] dark:text-white
    dark:hover:from-[#4fc89a] dark:hover:to-[#3ba37d] dark:shadow-[#1e293b]/50
  `,
  notify: `
    bg-gradient-to-r from-yellow-500 to-yellow-600 text-white 
    hover:from-yellow-600 hover:to-yellow-500 shadow-md hover:shadow-lg 
    dark:from-[#eab308] dark:to-[#ca8a04]
  `,
  cancel: `
    bg-gradient-to-r from-red-500 to-red-700 text-white 
    hover:from-red-600 hover:to-red-800 shadow-md hover:shadow-lg 
    dark:from-[#b91c1c] dark:to-[#7f1d1d] dark:hover:from-[#991b1b] dark:hover:to-[#dc2626]
    max-md:text-xs
  `,
  default: `
    bg-gradient-to-r from-medium to-light text-white 
    hover:from-light hover:to-medium shadow-md hover:shadow-lg
    dark:from-slate-700 dark:to-slate-600 dark:hover:from-slate-600 dark:hover:to-slate-700
  `
  };
  
  const buttonClass = `
    px-8 ${padding ? padding : "py-4"} ${margines ? margines : 'mt-6'} grow-1 text-sm font-semibold leading-6 rounded-lg transition-all duration-300 ease-in-out 
    transform hover:scale-105 active:scale-95 
    ${variantClasses[variant]} ${className}
  `;  
  useEffect(() => {
    Sentry.captureException(new Error("Testowy błąd Sentry!"));
  }, []);

return (
    <>
      {href ? (
        <Link
          to={href}
          className={buttonClass}
          {...props}
          rel="noopener noreferrer"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Ładowanie...
            </span>
          ) : (
            children
          )}
        </Link>
      ) : (
        <>
          <button
            type={props.type || "button"}
            onClick={handleClick}
            className={buttonClass}
            data-tooltip-id={tooltipId || ""}
            data-tooltip-place="bottom"
            disabled={disabled || isLoading} // Blokowanie przycisku, jeśli jest ładowanie lub disabled
            {...props}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Ładowanie...
              </span>
            ) : (
              children
            )}
          </button>
          {tooltip && (
            <Tooltip
              id={tooltipId || "default-tooltip-id"}
              style={{
                position: "fixed",
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
