import React, { useState } from "react"

// Okładka książki: lazy loading + async decode + skeleton, dopóki się nie załaduje
const BookCover = ({ src, alt, className = "w-16 h-24" }) => {
  const [loaded, setLoaded] = useState(false)

  if (!src) {
    return <div className={`${className} rounded-lg bg-gray-100 dark:bg-slate-700 shrink-0`} aria-hidden="true" />
  }

  return (
    <div className={`${className} relative rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-700 shrink-0`}>
      {/* skeleton pod spodem – widoczny tylko przed załadowaniem */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${loaded ? "opacity-0" : "opacity-100"}`} />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  )
}

export default BookCover