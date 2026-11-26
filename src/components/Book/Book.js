import React from "react"
import Title from "../Title/Title"
import DeliveryInfo from "../DeliveryInfo/DeliveryInfo"
import { MarkdownText } from "../../utils/markdownText"

const logo = `<svg width="800" height="1200" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0A2A43"/>
  <text x="50%" y="55%" font-size="60" fill="#FFFFFF" text-anchor="middle" font-family="sans-serif">
    CEEA Poznań
  </text>
  <text x="50%" y="65%" font-size="40" fill="#2BB4A8" text-anchor="middle" font-family="sans-serif">
    Materiały kursowe
  </text>
</svg>`

const svgFallback = `data:image/svg+xml;utf8,${encodeURIComponent(logo)}`

const Book = ({
  originalId,
  image,
  title,
  editor,
  year,
  price,
  publisher,
  covertype,
  printOnDemand,
  additionalInformation,
  available,
  reprint,
  stockQuantity,
}) => {
  const inStock = available && stockQuantity > 0

  return (
    <article className="mx-auto flex max-w-screen-xl flex-col items-center gap-6 py-6 text-center md:flex-row md:items-start md:gap-6 md:py-8 md:text-left lg:gap-8 lg:py-10">
      {/* Cover */}
      <div className="mx-auto shrink-0 md:mx-0">
        <img
          className="h-auto w-44 rounded-xl object-cover shadow-sm sm:w-48 md:w-40 lg:w-56 xl:w-64"
          src={image?.fluid?.src || svgFallback}
          alt={title}
          loading="lazy"
        />
      </div>

      {/* Meta */}
      <div className="flex w-full min-w-0 flex-1 flex-col items-center md:items-start">
        <div className="mb-4 flex flex-wrap justify-center gap-2 md:justify-start">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
              inStock
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200"
                : "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200"
            }`}
          >
            {inStock ? "Dostępny" : "Niedostępny"}
          </span>
          {inStock && (
            <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800 dark:border-sky-700 dark:bg-sky-900/40 dark:text-sky-200">
              Dostępność – {stockQuantity} szt.
            </span>
          )}
          {reprint && (
            <span className="inline-flex items-center rounded-full bg-[#002C7C] px-3 py-1 text-xs font-semibold text-white">
              W dodruku
            </span>
          )}
          {printOnDemand && (
            <span className="inline-flex items-center rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white">
              Na żądanie
            </span>
          )}
        </div>

        <Title
          tag="h4"
          className="text-lg font-semibold text-[#002C7C] dark:text-sky-300 sm:text-xl"
        >
          {title}
        </Title>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
          <span className="text-slate-500 dark:text-slate-400">Autor:</span>{" "}
          <span className="font-medium">red. {editor}</span>
        </p>

        <div className="my-5 w-full max-w-sm border-t border-slate-200 dark:border-slate-700 md:max-w-none" />

        <dl className="w-full max-w-sm space-y-2.5 text-sm md:max-w-none sm:text-base">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500 dark:text-slate-400">Wydawca:</dt>
            <dd className="text-right font-semibold">{publisher}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500 dark:text-slate-400">Rok wydania:</dt>
            <dd className="text-right font-semibold">{year}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500 dark:text-slate-400">Typ okładki:</dt>
            <dd className="text-right font-semibold">{covertype}</dd>
          </div>
        </dl>

        {additionalInformation && (
          <div className="mt-5 w-full max-w-sm space-y-2 md:max-w-none">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Dodatkowe informacje:
            </p>
            <div className="text-sm sm:text-base">
              <MarkdownText text={additionalInformation} />
            </div>
          </div>
        )}
      </div>

      {/* Price widget — own column from tablet up */}
      <div className="flex w-full max-w-sm shrink-0 justify-center md:w-64 md:max-w-none md:justify-start lg:w-72 xl:w-80">
        <DeliveryInfo
          price={price}
          available={inStock}
          title={title}
          originalId={originalId}
          image={image}
        />
      </div>
    </article>
  )
}

export default Book
