import React from "react"
import { motion } from "framer-motion"
import { FaFlask, FaClipboardList } from "react-icons/fa"
import { MarkdownText } from "../utils/markdownText.jsx"

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

const parseCourseProgram = (text) => {
  if (!text) return { intro: [], program: [], workshops: [] }

  const lines = text.split('\n').map(l => l.trim())
  let section = 'intro'
  const intro = []
  const program = []
  const workshops = []
  
  for (const line of lines) {
    if (!line) continue

    const lower = line.toLowerCase()

    const isProgramHeader = /^(program ramowy|program kursu)\s*[:=\-—]?$/i.test(line) || 
                           /^#{1,3}\s*(program ramowy|program kursu)/i.test(line)

    if (isProgramHeader) {
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

const CourseProgram = ({ text }) => {
  const { intro, program, workshops } = parseCourseProgram(text)

  const hasProgram = program.length > 0
  const hasWorkshops = workshops.length > 0

  return (
    <div className="space-y-10">
      {intro.length > 0 && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={slideUp}
        >
          <MarkdownText text={intro.join('\n')} />
        </motion.div>
      )}

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
                <div className="min-w-0 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  <MarkdownText text={item.text} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

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
                <MarkdownText text={line} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default CourseProgram