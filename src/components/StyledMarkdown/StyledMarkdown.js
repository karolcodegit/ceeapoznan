import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const safeUrl = url => {
  if (!url) return url
  const trimmed = String(url).trim()
  const lower = trimmed.toLowerCase()
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:")
  ) {
    return "#"
  }
  return trimmed
}

const StyledMarkdown = ({ children }) => {
  if (!children) return null

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      urlTransform={safeUrl}
      components={{
        p: ({ node, ...props }) => (
          <p {...props} className="mb-3 break-words text-gray-700 dark:text-gray-300 leading-7 last:mb-0" />
        ),
        ul: ({ node, ...props }) => (
          <ul {...props} className="list-disc list-inside mb-3 space-y-1 text-gray-700 dark:text-gray-300" />
        ),
        ol: ({ node, ...props }) => (
          <ol {...props} className="list-decimal list-inside mb-3 space-y-1 text-gray-700 dark:text-gray-300" />
        ),
        li: ({ node, ...props }) => (
          <li {...props} className="break-words leading-7" />
        ),
        strong: ({ node, ...props }) => (
          <strong {...props} className="font-semibold text-gray-900 dark:text-gray-100" />
        ),
        a: ({ node, ...props }) => (
          <a
            {...props}
            className="break-all text-[#016ABA] underline underline-offset-2 dark:text-sky-400"
            rel="noopener noreferrer"
            target={props.href?.startsWith("http") ? "_blank" : undefined}
          />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  )
}

export default StyledMarkdown