import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const StyledMarkdown = ({ children }) => {
  if (!children) return null

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ node, ...props }) => (
          <p {...props} className="mb-3 text-gray-700 dark:text-gray-300 leading-7 last:mb-0" />
        ),
        ul: ({ node, ...props }) => (
          <ul {...props} className="list-disc list-inside mb-3 space-y-1 text-gray-700 dark:text-gray-300" />
        ),
        ol: ({ node, ...props }) => (
          <ol {...props} className="list-decimal list-inside mb-3 space-y-1 text-gray-700 dark:text-gray-300" />
        ),
        li: ({ node, ...props }) => (
          <li {...props} className="leading-7" />
        ),
        strong: ({ node, ...props }) => (
          <strong {...props} className="font-semibold text-gray-900 dark:text-gray-100" />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  )
}

export default StyledMarkdown