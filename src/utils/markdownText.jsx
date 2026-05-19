import React, { useMemo } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"

export const MarkdownText = ({ text }) => {
  const modifiedText = useMemo(() => {
    if (!text) return ""

    const lines = text.split('\n')
    const result = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()

      // Pusta linia
      if (trimmed === '') {
        result.push('')
        continue
      }

      // NIE modyfikuj linii z obrazkami markdown: ![alt](url)
      const isImage = /^!\[.*?\]\(.*?\)/.test(trimmed)
      if (isImage) {
        result.push(line)
        continue
      }

      // NIE modyfikuj linii z linkami markdown: [text](url)
      const isLink = /^\[.*?\]\(.*?\)/.test(trimmed)
      if (isLink) {
        result.push(line)
        continue
      }

      // Elementy listy – zostaw czyste
      const isListItem = /^\s*[*\-+]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)
      if (isListItem) {
        result.push(line)
        continue
      }

      // Zwykły tekst – dodaj podwójny enter dla nowego paragrafu
      const nextLine = lines[i + 1]
      const nextTrimmed = nextLine ? nextLine.trim() : ''
      const isNextEmpty = nextTrimmed === ''
      const isNextSpecial = nextLine && (
        /^\s*[*\-+.\d]/.test(nextLine) ||
        /^!\[/.test(nextLine) ||
        /^\[/.test(nextLine)
      )

      if (isNextEmpty || i === lines.length - 1 || isNextSpecial) {
        result.push(line)
      } else {
        // Kontynuacja paragrafu – dodaj spację
        result.push(line + ' ')
      }
    }

    return result.join('\n')
  }, [text])

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        img: ({ node, ...props }) => (
          <img
            {...props}
            className="rounded-lg shadow-md my-4 max-w-full h-auto block mx-auto"
            loading="lazy"
            decoding="async"
          />
        ),
        a: ({ node, ...props }) => (
          <a
            {...props}
            className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
            target="_blank"
            rel="noopener noreferrer"
          />
        ),
        p: ({ node, ...props }) => (
          <p {...props} className="mb-4 text-gray-700 dark:text-gray-300 leading-7" />
        ),
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
      }}
    >
      {modifiedText}
    </ReactMarkdown>
  )
}