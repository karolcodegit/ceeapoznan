import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import { motion, useReducedMotion } from "framer-motion"
import PageHeroV2 from "../../components/PageHeroV2/PageHeroV2"
import Paragraph from "../../components/Paragraph/Paragraph"
import Button from "../../components/Button/Button"
import SideInfoPanel from "../../components/SideInfoPanel/SideInfoPanel"
import { slugify } from "../../utils/slugify"
import StyledMarkdown from "../../components/StyledMarkdown/StyledMarkdown"
import { FaFacebook } from "react-icons/fa"
import { getYearFromDate } from "../../utils/getYearFromDate"
import CourseProgram from "../../templates/CourseProgram"
import FormRegister from "../../components/Form/FormRegister"
import Seo from "../../components/seo"
import CourseDetails from "../../components/CourseDetails/CourseDetails"

function courseDocumentTitle(course, sub) {
  if (!course?.title) return null
  if (sub === "szczegoly") return `${course.title} — szczegóły | CEEA Poznań`
  if (sub === "rejestracja") return `Rejestracja — ${course.title} | CEEA Poznań`
  if (sub === "formularz-wyslany") return `Formularz wysłany | CEEA Poznań`
  return `${course.title} | CEEA Poznań`
}
import {
  fadeUp,
  staggerContainer as staggerBase,
  withReducedMotion,
} from "../../utils/motionVariants"

const API_URL = process.env.GATSBY_REGISTER_ENDPOINT
const BASE = "/kursy"

const fadeInBase = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.45 } },
}
const slideLeftBase = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}
const scaleInBase = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}
const viewportSettings = { once: true, margin: "-60px" }

const CourseClient2 = ({ location }) => {
  const reduceMotion = useReducedMotion()
  const fadeIn = withReducedMotion(fadeInBase, reduceMotion)
  const staggerContainer = withReducedMotion(staggerBase, reduceMotion)
  const slideUp = withReducedMotion(fadeUp, reduceMotion)
  const slideLeft = withReducedMotion(slideLeftBase, reduceMotion)
  const scaleIn = withReducedMotion(scaleInBase, reduceMotion)

  const segments = location.pathname.split("/").filter(Boolean)
  // ["kursy", rok, slug, sub?, ...]
  const slug = segments[2] || ""
  const yearSeg = segments[1] || ""
  const last = (segments[segments.length - 1] || "").toLowerCase()
  const sub =
    last === "formularz-wyslany"
      ? "formularz-wyslany"
      : (segments[3] || "").toLowerCase()

  const [course, setCourse] = useState(undefined)
  const [company, setCompany] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetch(`${API_URL}/courses`)
      .then(r => {
        if (!r.ok) throw new Error("courses")
        return r.json()
      })
      .then(({ courses }) => {
        if (cancelled) return
        const found = (courses || []).find(c => slugify(c.title) === slug)
        setCourse(found || null)
      })
      .catch(() => {
        if (!cancelled) setCourse(null)
      })

    fetch(`${API_URL}/company`)
      .then(r => (r.ok ? r.json() : null))
      .then(j => {
        if (!cancelled && j) setCompany(j.company)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [slug])

  useEffect(() => {
    if (!course?.title || typeof document === "undefined") return
    const next = courseDocumentTitle(course, sub)
    if (next) document.title = next
  }, [course, sub])

  if (course === undefined) {
    return (
      <div className="w-full bg-white dark:bg-slate-950">
        <PageHeroV2
          title="Kurs CEEA Poznań"
          subtitle="Regionalne Centrum CEEA"
          description="Szczegóły szkolenia anestezjologii w Regionalnym Centrum CEEA w Poznaniu — program, terminy i zapisy."
          crumbs={[
            { label: "Strona główna", to: "/" },
            { label: "Kursy", to: `${BASE}/` },
            { label: "Kurs" },
          ]}
        />
        <div
          className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
          aria-busy="true"
          aria-label="Wczytywanie szczegółów kursu"
        >
          <div className="space-y-4">
            <div className="h-8 w-2/3 max-w-xl animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-slate-200/80 dark:bg-slate-800" />
            <div className="h-4 w-5/6 max-w-2xl animate-pulse rounded bg-slate-200/80 dark:bg-slate-800" />
            <div className="mt-8 h-48 animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    )
  }

  if (course === null) {
    return (
      <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-gray-100">
        <PageHeroV2
          title="Nie znaleziono kursu"
          subtitle="Brak w bazie"
          description={`Adres ${location.pathname} nie wskazuje na istniejący kurs.`}
          crumbs={[
            { label: "Strona główna", to: "/" },
            { label: "Kursy", to: `${BASE}/` },
            { label: "Brak" },
          ]}
          actions={
            <Link
              to={`${BASE}/`}
              className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#002C7C] transition hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
            >
              Lista kursów
            </Link>
          }
        />
      </div>
    )
  }

  const courseYear = getYearFromDate(course.start_date || course.date_label)
  const courseBase = `${BASE}/${yearSeg || courseYear}/${slug}`

  if (sub === "szczegoly") {
    return (
      <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-gray-100">
        <PageHeroV2
          title="Szczegóły kursu"
          subtitle={course.title}
          description={course.date_label || ""}
          crumbs={[
            { label: "Strona główna", to: "/" },
            { label: "Kursy", to: `${BASE}/` },
            { label: course.title, to: courseBase },
            { label: "Szczegóły" },
          ]}
          actions={
            <Link
              to={courseBase}
              className="inline-flex rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
            >
              Wróć do kursu
            </Link>
          }
        />
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <CourseDetails course={course} company={company} />
        </div>
      </div>
    )
  }

  if (sub === "rejestracja") {
    const availableCourse = course.available
      ? {
          originalId: course.course_id,
          courseCost: course.price,
          available: course.available,
          courseDuration: course.points,
          nameCourse: course.title,
        }
      : null

    const registerFormNode = {
      positioncheckbox: (
        Array.isArray(course.meal_options) ? course.meal_options : []
      ).map((m, i) => ({
        id: m.id || `opt-${i}`,
        price: m.price,
        label: m.label,
        available: m.available,
      })),
      dish: (Array.isArray(course.dishes) ? course.dishes : []).map(d => ({
        dish: d.name,
      })),
    }

    return (
      <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-gray-100">
        <PageHeroV2
          title="Rejestracja"
          subtitle={course.title}
          description="Wypełnij formularz zapisu na kurs CEEA."
          crumbs={[
            { label: "Strona główna", to: "/" },
            { label: "Kursy", to: `${BASE}/` },
            { label: course.title, to: courseBase },
            { label: "Rejestracja" },
          ]}
        />
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <FormRegister
            data={{ allDatoCmsRegisterform: { nodes: [registerFormNode] } }}
            availableCourse={availableCourse}
          />
        </div>
      </div>
    )
  }

  if (sub === "formularz-wyslany") {
    return (
      <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-gray-100">
        <PageHeroV2
          title="Formularz wysłany"
          subtitle="Dziękujemy za rejestrację"
          description={`Potwierdzenie oraz dane do płatności dla kursu „${course.title}” otrzymasz mailem.`}
          crumbs={[
            { label: "Strona główna", to: "/" },
            { label: "Kursy", to: `${BASE}/` },
            { label: "Potwierdzenie" },
          ]}
          actions={
            <Link
              to={`${BASE}/`}
              className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#002C7C] transition hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
            >
              Lista kursów
            </Link>
          }
        />
      </div>
    )
  }

  const days = Array.isArray(course.program) ? course.program : []

  return (
    <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-gray-100">
      <PageHeroV2
        title={course.title}
        subtitle={
          course.course_number != null
            ? `Kurs nr ${course.course_number}`
            : "Kurs CEEA"
        }
        description={course.date_label || ""}
        crumbs={[
          { label: "Strona główna", to: "/" },
          { label: "Kursy", to: `${BASE}/` },
          { label: course.title },
        ]}
        actions={
          course.available ? (
            <Link
              to={`${courseBase}/rejestracja`}
              className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#002C7C] transition hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
            >
              Zapisz się
            </Link>
          ) : null
        }
      />

      <motion.div
        className="mx-auto flex max-w-6xl flex-col justify-between gap-12 px-4 py-12 sm:px-6 lg:flex-row lg:gap-16 lg:px-8 lg:py-16"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="w-full max-w-3xl">
          <motion.section
            className="border-b border-slate-200 pb-10 dark:border-slate-700"
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={staggerContainer}
          >
            <motion.div variants={slideUp}>
              <CourseProgram text={course.description} />
            </motion.div>
          </motion.section>

          <motion.section
            className="pt-12"
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={staggerContainer}
          >
            <motion.h2
              variants={slideLeft}
              className="text-2xl font-bold text-[#002C7C] dark:text-sky-300"
            >
              Program kursu
            </motion.h2>

            <div className="mt-8 space-y-10">
              {days.length === 0 ? (
                <motion.div
                  className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20"
                  variants={scaleIn}
                >
                  <Paragraph className="text-lg font-medium text-amber-800 dark:text-amber-200">
                    Plan w trakcie tworzenia
                  </Paragraph>
                </motion.div>
              ) : (
                days.map((day, index) => {
                  const events = (
                    Array.isArray(day.events)
                      ? day.events
                      : String(day.events || "").split("\n")
                  )
                    .map(e =>
                      (
                        e && typeof e === "object"
                          ? e.event ?? ""
                          : String(e ?? "")
                      )
                        .toString()
                        .trim()
                    )
                    .filter(Boolean)

                  return (
                    <motion.div key={index} className="relative" variants={slideUp}>
                      <div className="mb-6 flex items-center md:gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                            Dzień {index + 1}
                          </h3>
                          {day.date && (
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                              {day.date}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1 md:ml-6 md:border-l-2 md:border-slate-200 md:pl-10 dark:md:border-slate-700">
                        {events.map((eventLine, eventIndex) => {
                          const isFacebookLink =
                            eventLine.includes("facebook.com")
                          const isWorkshop = eventLine
                            .toLowerCase()
                            .includes("warsztat")

                          return (
                            <div
                              key={eventIndex}
                              className={`relative py-3 ${
                                isWorkshop
                                  ? "-ml-10 rounded-r-lg border-l-4 border-[#0C6478] bg-sky-50 pl-10 pr-4 dark:bg-sky-900/20"
                                  : ""
                              }`}
                            >
                              {isFacebookLink ? (
                                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                                  <div className="flex items-center gap-2 text-[#002C7C] dark:text-sky-400">
                                    <FaFacebook className="text-xl" />
                                    <span className="text-sm font-semibold">
                                      Facebook:
                                    </span>
                                  </div>
                                  <StyledMarkdown>{eventLine}</StyledMarkdown>
                                </div>
                              ) : (
                                <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 md:text-base">
                                  {isWorkshop && (
                                    <span className="mb-1 inline-flex items-center gap-1.5 font-semibold text-[#0C6478] dark:text-sky-300">
                                      Warsztaty
                                    </span>
                                  )}
                                  <StyledMarkdown>{eventLine}</StyledMarkdown>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </motion.section>

          {(course.info_description || course.participation_condition) && (
            <motion.div
              className="mt-12 flex justify-start"
              initial="hidden"
              whileInView="visible"
              viewport={viewportSettings}
              variants={slideUp}
            >
              <Button href={`${courseBase}/szczegoly`} variant="notify">
                Szczegółowe informacje o kursie
              </Button>
            </motion.div>
          )}
        </div>

        <motion.div
          className="w-full lg:w-auto lg:min-w-[320px]"
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={slideLeft}
        >
          <SideInfoPanel
            money={course.price}
            points={course.points}
            available={course.available}
            nameCourse={course.title}
            date={course.date_label}
            basePath={BASE}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

export const Head = ({ location }) => {
  const path = location?.pathname || "/kursy/"
  const isPrivate = /\/(rejestracja|formularz-wyslany)\/?$/i.test(path)
  return (
    <Seo
      title={isPrivate ? "Rejestracja na kurs" : "Kurs CEEA Poznań"}
      description={
        isPrivate
          ? "Formularz zapisu na kurs Regionalnego Centrum CEEA w Poznaniu."
          : "Kurs anestezjologii Regionalnego Centrum CEEA w Poznaniu — program, terminy i zapisy dla lekarzy specjalistów oraz rezydentów."
      }
      pathname={path}
      robots={isPrivate ? "noindex,nofollow" : "index,follow"}
    />
  )
}

export default CourseClient2
