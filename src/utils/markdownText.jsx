import React, { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { FaImage, FaFilePdf, FaExternalLinkAlt, FaAward } from "react-icons/fa"

// --- Responsywny obrazek ---

const MarkdownImage = ({ node, src, alt, title }) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  if (src && src.toLowerCase().endsWith('.pdf')) {
    return (
      <figure className="my-6 flex justify-center">
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <FaFilePdf className="text-2xl text-red-500" />
          </div>
          <figcaption className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {alt || "Dokument PDF"}
          </figcaption>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <span>Otwórz PDF</span>
            <FaExternalLinkAlt className="text-xs" />
          </a>
        </div>
      </figure>
    )
  }

  if (error || !src) {
    return (
      <figure className="my-6 flex justify-center">
        <div className="w-full max-w-lg aspect-video bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center gap-3 text-gray-400 dark:text-gray-500">
          <FaImage className="text-3xl opacity-60" />
          <figcaption className="text-sm font-medium">Nie udało się załadować obrazu</figcaption>
        </div>
      </figure>
    )
  }

  return (
    <figure className="my-6 flex justify-center">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm p-4 sm:p-6">
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-100 dark:bg-gray-700" />
        )}
        <img
          src={src}
          alt={alt || ''}
          title={title}
          className={`w-full h-auto max-h-[240px] sm:max-h-[280px] object-contain transition-opacity duration-500 ease-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      </div>
      {alt && <figcaption className="sr-only">{alt}</figcaption>}
    </figure>
  )
}

// --- Główny komponent ---

export const MarkdownText = ({ text, components: externalComponents = {} }) => {
  if (!text) return null

  // Połącz linki akcji (PDF/SOWE) z osobnych linii w jedną linię
  // dzięki temu trafią do jednego paragrafu i będą obok siebie na desktopie
  let processedText = text
  let prev = ''
  while (processedText !== prev) {
    prev = processedText
    processedText = processedText.replace(
      /(\[.*?\]\([^)]*?(?:\.pdf|sowe\.org\.pl)[^)]*?\))(?:\s*\n\s*)(\[.*?\]\([^)]*?(?:\.pdf|sowe\.org\.pl)[^)]*?\))/g,
      '$1 $2'
    )
  }

  const defaultComponents = {
    img: MarkdownImage,
    
    a: ({ node, href, children, ...props }) => {
      const isPdf = href && href.toLowerCase().endsWith('.pdf')
      const isSowe = href && href.includes('sowe.org.pl')
      
      if (isSowe) {
        return (
          <a
            {...props}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 h-10 mt-5 rounded-lg text-sm font-medium transition-colors no-underline whitespace-nowrap bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
          >
            <FaAward className="text-lg text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold">Certyfikat zgodności SOWE</span>
            <FaExternalLinkAlt className="text-xs opacity-60" />
          </a>
        )
      }
      
      if (isPdf) {
        return (
          <a
            {...props}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-medium transition-colors no-underline whitespace-nowrap bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
          >
            <FaFilePdf className="text-lg" />
            <span>{children}</span>
            <FaExternalLinkAlt className="text-xs opacity-60" />
          </a>
        )
      }

      return (
        <a
          {...props}
          href={href}
          className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity font-medium"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      )
    },
    
    // Paragraf zawierający TYLKO linki akcji → pełna szerokość, wyśrodkowane
    p: ({ node, children, ...props }) => {
      const childArray = React.Children.toArray(children)
      
      const isActionElement = (child) => {
        if (!React.isValidElement(child)) return false
        const href = child.props?.href || ''
        return href.toLowerCase().endsWith('.pdf') || href.includes('sowe.org.pl')
      }
      
      const hasActions = childArray.some(isActionElement)
      const hasOnlyActionsAndWhitespace = childArray.every(child => {
        if (typeof child === 'string') return child.trim() === ''
        return React.isValidElement(child) && child.props?.href !== undefined
      })
      
      const isActionsRow = hasActions && hasOnlyActionsAndWhitespace

      return (
        <p 
          {...props} 
          className={`mb-4 text-gray-700 dark:text-gray-300 leading-7 last:mb-0 ${
            isActionsRow ? 'flex flex-wrap justify-center gap-3 items-center w-full py-2' : ''
          }`}
        >
          {children}
        </p>
      )
    },
    
    ul: ({ node, ...props }) => (
      <ul {...props} className="list-disc list-inside mb-4 space-y-1 text-gray-700 dark:text-gray-300" />
    ),
    
    ol: ({ node, ...props }) => (
      <ol {...props} className="list-decimal list-inside mb-4 space-y-1 text-gray-700 dark:text-gray-300" />
    ),
    
    li: ({ node, ...props }) => (
      <li {...props} className="leading-7" />
    ),
    
    h1: ({ node, ...props }) => (
      <h1 {...props} className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100" />
    ),
    
    h2: ({ node, ...props }) => (
      <h2 {...props} className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100" />
    ),
    
    h3: ({ node, ...props }) => (
      <h3 {...props} className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100" />
    ),
    
    h4: ({ node, ...props }) => (
      <h4 {...props} className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100" />
    ),
    
    strong: ({ node, ...props }) => (
      <strong {...props} className="font-semibold text-gray-900 dark:text-gray-100" />
    ),
    
    blockquote: ({ node, ...props }) => (
      <blockquote {...props} className="border-l-4 border-primary pl-4 italic my-4 text-gray-600 dark:text-gray-400" />
    ),
  }

  const mergedComponents = { ...defaultComponents, ...externalComponents }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={mergedComponents}
    >
      {processedText}
    </ReactMarkdown>
  )
}