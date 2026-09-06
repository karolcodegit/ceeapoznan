import React from "react"
import { motion } from "framer-motion"
import { graphql } from "gatsby"
import Title from "../components/Title/Title"
import Paragraph from "../components/Paragraph/Paragraph"
import Line from "../components/Line/Line"
import Button from "../components/Button/Button"
import SideInfoPanel from "../components/SideInfoPanel/SideInfoPanel"
import { MarkdownText } from '../utils/markdownText.jsx'
import { slugify } from "../utils/slugify"
import StyledMarkdown from "../components/StyledMarkdown/StyledMarkdown"
import { FaFacebook } from "react-icons/fa"
import { getYearFromDate } from "../utils/getYearFromDate"
import CourseProgram from "./CourseProgram"

// --- Animacje ---

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
}

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

const timelineItem = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

const viewportSettings = {
  once: true,
  margin: "-60px",
}

// --- Komponent ---

const Course = ({ data }) => {
  const { datoCmsCourse: course } = data

  return (
    <motion.div
      className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 gap-12 lg:gap-20 flex flex-col lg:flex-row justify-between"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Lewa kolumna - treść */}
      <div className="max-w-3xl w-full">
        {/* Nagłówek kursu */}
        <motion.section
          className="border-b border-gray-200 dark:border-gray-700 pb-10"
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={staggerContainer}
        >
          <motion.div variants={slideLeft}>
            <Title tag="h1" className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {course.nameCourse}
            </Title>
            <Line />
          </motion.div>
          <motion.div variants={slideUp} className="mt-6">
          <CourseProgram text={course.description} />
          </motion.div>
        </motion.section>

        {/* Program kursu */}
        <motion.section
          className="pt-16"
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={staggerContainer}
        >
          <motion.div className="py-10" variants={slideLeft}>
            <Title tag="h2" className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Program kursu
            </Title>
            <Line />
          </motion.div>

          <div className="space-y-10">
            {course.daycourse.length === 0 ? (
              <motion.div
                className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6"
                variants={scaleIn}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <Paragraph className="text-lg text-amber-800 dark:text-amber-200 font-medium">
                    Plan w trakcie tworzenia
                  </Paragraph>
                </div>
              </motion.div>
            ) : (
              course.daycourse.map((day, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  variants={slideUp}
                >
                  {/* Nagłówek dnia */}
                  <div className="flex items-center md:gap-4 mb-6">
                    <div className="flex-shrink-0 md:w-12 md:h-12  rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      
                    </div>
                    <div>
                      <Title
                        tag="h3"
                        className="text-xl font-semibold text-gray-900 dark:text-gray-100"
                      >
                        Dzień {index + 1}
                      </Title>
                      {day.date && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                          {day.date}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Lista wydarzeń */}
                  <div className="md:ml-6 md:pl-10 md:border-l-2 md:border-gray-200 dark:border-gray-700 space-y-1">
                    {day.event.map((event, eventIndex) => {
                      const isFacebookLink = event.event.includes("facebook.com")
                      const isWorkshop = event.event.toLowerCase().includes("warsztat")

                      return (
                        <motion.div
                          key={eventIndex}
                          className={`relative py-3 ${
                            isWorkshop
                              ? "bg-blue-50 dark:bg-blue-900/20 -ml-10 pl-10 pr-4 rounded-r-lg border-l-4 border-blue-500"
                              : ""
                          }`}
                        >
                          {isFacebookLink ? (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                <FaFacebook className="text-xl" />
                                <span className="font-semibold text-sm">Facebook:</span>
                              </div>
                              <StyledMarkdown>{event.event}</StyledMarkdown>
                            </div>
                          ) : (
                            <div className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                              {isWorkshop && (
                                <span className="inline-flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-semibold mb-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                  </svg>
                                  Warsztaty
                                </span>
                              )}
                              <StyledMarkdown>{event.event}</StyledMarkdown>
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.section>

        {/* Przycisk szczegółów */}
        {(course.detailedInformationAboutTheCourse ||
          course.detailedInformationAboutTheHotel) && (
          <motion.div
            className="flex justify-start mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={slideUp}
          >
            <Button
              href={`/kursy/${getYearFromDate(course.date)}/${slugify(course.nameCourse)}/szczegoly`}
              variant="notify"
            >
              Szczegółowe informacje o kursie
            </Button>
          </motion.div>
        )}
      </div>

      {/* Prawa kolumna - panel boczny */}
      <motion.div
        className="w-full lg:w-auto lg:min-w-[320px]"
        initial="hidden"
        whileInView="visible"
        viewport={viewportSettings}
        variants={slideLeft}
      >
        <SideInfoPanel
          money={course.courseCost}
          time={course.courseDuration}
          available={course.available}
          nameCourse={course?.nameCourse}
          date={course.date}
        />
      </motion.div>
    </motion.div>
  )
}

export const courseQuery = graphql`
  query CourseQuery($id: String!) {
    datoCmsCourse(id: { eq: $id }) {
      id
      nameCourse
      description
      date
      image {
        url
      }
      daycourse {
        date
        event {
          event
        }
      }
      courseDuration
      courseCost
      available

      detailedInformationAboutTheCourse {
        imageHotel {
          url
        }
        additionalInformation
        description
        emailHotel
        password
        phone
      }

      detailedInformationAboutTheHotel {
        conditionsOfParticipation
        pictureHotel {
          url
        }
        extras
      }
    }
  }
`

export default Course
