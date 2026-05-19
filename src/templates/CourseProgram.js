import React from "react"
import { motion } from "framer-motion"
import { FaFlask, FaClipboardList, FaFilePdf, FaExternalLinkAlt } from "react-icons/fa"
import { MarkdownText } from "../utils/markdownText.jsx"

// --- Animacje ---

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
}

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

const viewportSettings = {
  once: true,
  margin: "-60px",
}

// --- Parser ---

const parseCourseProgram = (text) => {
  if (!text) return { intro: [], program: [], workshops: [] }

  const lines = text.split('\n').map(l => l.trim())
  let section = 'intro'
  const program = []
  const workshops = []
  const intro = []

  for (const line of lines) {
    if (!line) continue

    const lower = line.toLowerCase()

    if (lower.includes('program ramowy') || lower.includes('program kursu')) {
      section = 'program'
      continue
    }
    if (lower.includes('warsztaty')) {
      section = 'workshops'
      const colonIndex = line.indexOf(':')
      if (colonIndex !== -1) {
        const desc = line.slice(colonIndex + 1).trim()
        if (desc) workshops.push(desc)
      }
      continue
    }

    if (section === 'intro') {
      intro.push(line)
    } else if (section === 'program') {
      const match = line.match(/^(\d+)\.\s*(.+)/)
      if (match) {
        program.push({ number: parseInt(match[1], 10), text: match[2] })
      } else if (line) {
        program.push({ number: null, text: line })
      }
    } else if (section === 'workshops') {
      workshops.push(line)
    }
  }

  return { intro, program, workshops }
}

// --- Custom Markdown Components (stały rozmiar zdjęć + PDF jako przycisk) ---

const CustomMarkdownComponents = {
  img: ({ node, ...props }) => (
    <div className="my-4 flex justify-center">
      <img
        {...props}
        className="rounded-lg shadow-md object-cover"
        style={{
          width: '320px',
          height: '320px',
          maxWidth: '100%',
        }}
        loading="lazy"
        decoding="async"
      />
    </div>
  ),
  a: ({ node, href, children, ...props }) => {
    const isPdf = href && href.toLowerCase().endsWith('.pdf')

    if (isPdf) {
      return (
        <a
          {...props}
          href={href}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 font-medium text-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors my-2"
          target="_blank"
          rel="noopener noreferrer"
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
}

// --- Komponent ---

const CourseProgram = ({ text }) => {
  const { intro, program, workshops } = parseCourseProgram(text)

  const hasProgram = program.length > 0
  const hasWorkshops = workshops.length > 0

  return (
    <div className="space-y-10">
      {/* Intro – zdjęcia 320x320 + PDF jako przyciski */}
      {intro.length > 0 && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={slideUp}
        >
          <MarkdownText
            text={intro.join('\n')}
            components={CustomMarkdownComponents}
          />
        </motion.div>
      )}

      {/* Program ramowy */}
      {hasProgram && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={staggerContainer}
        >
          <div className="flex items-center gap-3 mb-6">
            <FaClipboardList className="text-primary text-xl" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Program ramowy
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {program.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                variants={slideUp}
              >
                {item.number && (
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-sm font-bold flex items-center justify-center mt-0.5">
                    {item.number}
                  </span>
                )}
                <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Warsztaty – zdjęcia 320x320 + PDF jako przyciski */}
      {hasWorkshops && (
        <motion.div
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={staggerContainer}
        >
          <div className="flex items-center gap-3 mb-3">
            <FaFlask className="text-blue-600 dark:text-blue-400 text-xl" />
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              Warsztaty
            </h3>
          </div>
          <div className="space-y-2">
            {workshops.map((line, i) => (
              <motion.div key={i} variants={slideUp}>
                <MarkdownText
                  text={line}
                  components={CustomMarkdownComponents}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default CourseProgram