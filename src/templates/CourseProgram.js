import React from "react"
import { motion } from "framer-motion"
import { FaFlask, FaClipboardList } from "react-icons/fa"

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
      // Jeśli linia zawiera też opis (np. "Warsztaty: temat wkrótce")
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
      // Parsowanie: "1. Tekst tematu" lub "01. Tekst"
      const match = line.match(/^(\d+)\.\s*(.+)/)
      if (match) {
        program.push({ number: parseInt(match[1], 10), text: match[2] })
      } else if (line) {
        // Jeśli linia nie pasuje do wzorca, ale nie jest pusta – dodaj jako dodatkowy tekst
        program.push({ number: null, text: line })
      }
    } else if (section === 'workshops') {
      workshops.push(line)
    }
  }

  return { intro, program, workshops }
}

// --- Komponent ---

const CourseProgram = ({ text }) => {
  const { intro, program, workshops } = parseCourseProgram(text)

  const hasProgram = program.length > 0
  const hasWorkshops = workshops.length > 0

  return (
    <div className="space-y-10">
      {/* Intro / opis przed programem */}
      {intro.length > 0 && (
        <div className="text-gray-700 dark:text-gray-300 text-base leading-7">
          {intro.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
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

      {/* Warsztaty */}
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
              <motion.p
                key={i}
                className="text-blue-800 dark:text-blue-200 text-sm"
                variants={slideUp}
              >
                {line}
              </motion.p>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default CourseProgram