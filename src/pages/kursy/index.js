import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import { motion } from "framer-motion"

import Seo from "../../components/seo"
import PageHeroV2 from "../../components/PageHeroV2/PageHeroV2"
import { slugify } from "../../utils/slugify"
import { getYearFromDate } from "../../utils/getYearFromDate"

const API_URL = process.env.GATSBY_REGISTER_ENDPOINT

const Courses2 = () => {
  const [courses, setCourses] = useState(null)

  useEffect(() => {
    let cancelled = false
    if (!API_URL) {
      setCourses([])
      return undefined
    }
    fetch(`${API_URL}/courses?scope=home`)
      .then(r => {
        if (!r.ok) throw new Error("courses")
        return r.json()
      })
      .then(({ courses: list }) => {
        if (!cancelled) {
          setCourses(
            (list || [])
              .slice()
              .sort(
                (a, b) => (a.course_number ?? 999) - (b.course_number ?? 999)
              )
          )
        }
      })
      .catch(() => {
        if (!cancelled) setCourses([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-gray-100">
      <PageHeroV2
        title="Kursy"
        subtitle="Regionalne Centrum CEEA w Poznaniu"
        description="Aktualna oferta szkoleń dla lekarzy specjalistów oraz rezydentów anestezjologii i intensywnej terapii — w europejskim formacie CME."
        crumbs={[
          { label: "Strona główna", to: "/" },
          { label: "Kursy" },
        ]}
        actions={
          <>
            <Link
              to="/archiwum_kursow/"
              className="inline-flex rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
            >
              Archiwum kursów
            </Link>
            <Link
              to="/kontakt/"
              className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#002C7C] transition hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
            >
              Kontakt
            </Link>
          </>
        }
      />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {courses === null && (
          <div className="flex items-center justify-center py-20" role="status">
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-[#0C6478] border-t-transparent"
              aria-hidden="true"
            />
            <span className="ml-3 text-slate-600 dark:text-slate-400">
              Ładowanie kursów…
            </span>
          </div>
        )}

        {courses !== null && courses.length === 0 && (
          <p className="py-16 text-center text-slate-500 dark:text-slate-400">
            Brak kursów do wyświetlenia.
          </p>
        )}

        {courses !== null && courses.length > 0 && (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => {
              const courseSlug = slugify(course.title)
              const year = getYearFromDate(
                course.start_date || course.date_label
              )
              return (
                <li key={course.course_id}>
                  <motion.article
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="group relative flex h-full min-h-[280px] overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-700"
                    style={{
                      backgroundImage: course.image_url
                        ? `url(${course.image_url})`
                        : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundColor: "#0b1f3a",
                    }}
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-[#0b1f3a]/95 via-[#0b1f3a]/55 to-[#0b1f3a]/25 transition group-hover:via-[#0b1f3a]/45"
                      aria-hidden="true"
                    />
                    <Link
                      to={`/kursy/${year}/${courseSlug}`}
                      className="relative z-10 flex h-full w-full flex-col justify-between gap-6 p-6 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
                    >
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#E8A317]">
                          Kurs nr {course.course_number ?? "—"}
                        </p>
                        <h2 className="mt-2 text-xl font-bold leading-snug sm:text-2xl">
                          {course.title}
                        </h2>
                      </div>
                      <div className="flex items-end justify-between gap-3">
                        <p className="text-sm text-white/90">
                          {course.date_label || "Brak daty"}
                        </p>
                        <span
                          className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            course.available
                              ? "bg-emerald-100 text-emerald-900"
                              : "bg-rose-100 text-rose-900"
                          }`}
                        >
                          {course.available ? "Dostępne" : "Niedostępne"}
                        </span>
                      </div>
                    </Link>
                  </motion.article>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="flex flex-col gap-6 rounded-3xl bg-gradient-to-r from-[#002C7C] to-[#0C6478] px-6 py-10 text-white sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div>
            <h2 className="text-2xl font-bold">Masz pytania o zapisy?</h2>
            <p className="mt-2 max-w-xl text-white/85">
              Napisz do nas — chętnie pomożemy w wyborze kursu i formalnościach.
            </p>
          </div>
          <Link
            to="/kontakt/"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-[#002C7C] transition hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
          >
            Przejdź do kontaktu
          </Link>
        </div>
      </section>
    </div>
  )
}

export const Head = () => <Seo title="Kursy" />
export default Courses2
