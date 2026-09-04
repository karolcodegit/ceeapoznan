import React from "react"
import Markdown from "react-markdown"
import rehypeRaw from "rehype-raw"

const liClass = "ml-8 text-[0.9rem] leading-[3rem] mb-2 text-gray-900 dark:text-gray-100"

const StyledMarkdown = ({ children }) => (
  <div>
    <Markdown
      className="dark:text-gray-200 text-gray-900"
      rehypePlugins={[rehypeRaw]}
      components={{
        ol: ({ node, ...props }) => <ol className="list-decimal" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc" {...props} />,
        li: ({ node, ...props }) => <li className={liClass} {...props} />,
        a: ({ node, ...props }) => (
          <a
            className="font-bold underline text-blue-700 dark:text-blue-400"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        p: ({ node, ...props }) => <p className="leading-[3rem]" {...props} />,
      }}
    >
      {children}
    </Markdown>
  </div>
)

export default StyledMarkdown