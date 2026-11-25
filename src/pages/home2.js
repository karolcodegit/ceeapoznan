import * as React from "react"
import { useState, useEffect, Suspense } from "react"
import { graphql } from "gatsby"
import Seo from "../components/seo"
import { slugify } from "../utils/slugify"
import { getYearFromDate } from "../utils/getYearFromDate"
import { motion } from "framer-motion"
import { Link } from "gatsby"
import HeroParallax from "../components/Hero/HeroParallax"
const SponsorsSection = React.lazy(() =>
  import("../components/Sponsors/SponsorsSection")
)

// --- API ---

// obrazy z Cloudinary w rozmiarze pod ekran (bez megabajtowych oryginałów)
const cld = (url, w) =>
  url && url.includes("res.cloudinary.com")
    ? url.replace("/upload/", `/upload/w_${w},q_auto,f_auto/`)
    : url

const API_URL = process.env.GATSBY_REGISTER_ENDPOINT

const Home2Page = ({ data }) => {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    let cancelled = false
    const start = () =>
      fetch(`${API_URL}/courses?scope=home`)
        .then(r => {
          if (!r.ok) throw new Error("courses")
          return r.json()
        })
        .then(({ courses }) => {
          if (!cancelled) setCourses(courses || [])
        })
        .catch(() => {})
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(start, { timeout: 2500 })
    } else {
      setTimeout(start, 800)
    }
    return () => {
      cancelled = true
    }
  }, [])

  const currentCourse = courses.find(c => c.available === true)
  const futureCourses = courses.filter(c => c.is_next === true).slice(0, 3)

  const regCourse = currentCourse || courses[0]
  const websiteRegister = regCourse
    ? `/kursy/${getYearFromDate(
        regCourse.start_date || regCourse.date_label
      )}/${slugify(regCourse.title)}/rejestracja`
    : "#"

  return (
    <>
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-gray-100">
        {/* === HERO V2 (parallax) — wariant pod /home2 === */}
        <HeroParallax
          currentCourse={currentCourse}
          websiteRegister={websiteRegister}
          defaultImage={data.defaultImage}
        />

        {/* === NADCHODZĄCE KURSY === */}
        <section className="py-24 bg-slate-100 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-12 text-[#002C7C] dark:text-sky-300">
              Nadchodzące kursy i szkolenia
            </h2>
            <div
              className={`
                grid gap-10
                ${
                  futureCourses.length === 1
                    ? "grid-cols-1 max-w-xl mx-auto"
                    : futureCourses.length === 2
                    ? "md:grid-cols-2 sm:grid-cols-1 justify-items-center"
                    : "md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1"
                }
              `}
            >
              {futureCourses.map((course, i) => (
                <motion.div
                  key={course.course_id}
                  className="bg-white dark:bg-slate-700 rounded-3xl shadow-lg hover:shadow-2xl w-full overflow-hidden"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.15,
                    ease: "easeOut",
                  }}
                >
                  {course.image_url ? (
                    <img
                      src={cld(course.image_url, 600)}
                      alt={course.title}
                      className="rounded-t-3xl h-56 w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="rounded-t-3xl h-56 w-full bg-gradient-to-br from-[#016ABA] to-[#00C6FF] flex items-center justify-center">
                      <span className="text-5xl font-bold text-white">
                        {(course.title || "C").charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="p-6 text-left">
                    <h3 className="h-16 text-xl font-semibold text-[#016ABA] dark:text-sky-400 mb-3 line-clamp-2">
                      {course.title}
                    </h3>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                      <li className="flex items-center">
                        <span className="text-lg px-2">#️⃣</span>
                        <span>
                          Numer kursu:{" "}
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {course?.course_number ?? "Brak numeru"}
                          </span>
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-lg px-2">📅</span>
                        <span>
                          Data:{" "}
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {course?.date_label || "Data wkrótce"}
                          </span>
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-lg px-2">🌐</span>
                        <span>
                          Język:{" "}
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {course?.language === "en" ? "EN" : "PL"}
                          </span>
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-lg px-2">🖥</span>
                        <span>
                          Tryb:{" "}
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {course?.is_online ? "Online" : "Stacjonarny"}
                          </span>
                        </span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* === KRÓTKA INFORMACJA O NADCHODZĄCYM KURSIE === */}
        {currentCourse?.available && (
          <section className="bg-[#016ABA] dark:bg-sky-900 py-20 text-white">
            <div className="max-w-6xl mx-auto text-center px-6">
              <motion.h2
                className="text-3xl font-bold mb-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
              >
                Kurs już dostępny
              </motion.h2>

              <motion.p
                className="text-lg mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                Rejestracja otwarta! Zdobądź praktyczną wiedzę, doświadczenie i
                certyfikat CEEA.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link
                  to={websiteRegister}
                  className="bg-white text-[#016ABA] font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition"
                >
                  Zarejestruj się teraz
                </Link>
              </motion.div>
            </div>
          </section>
        )}

        {/* === SPONSORZY === */}
        <Suspense fallback={null}>
          <SponsorsSection />
        </Suspense>

        {currentCourse?.available && !!currentCourse?.info_description && (
          <section className="relative py-24 bg-gradient-to-b from-[#F0F8FF] via-[#E8F1FF] to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(2,132,199,0.15),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(14,165,233,0.15),transparent_70%)]"></div>

            <div className="relative max-w-5xl mx-auto px-6">
              <motion.h2
                className="text-3xl font-bold mb-12 text-[#002C7C] dark:text-sky-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
              >
                Dodatkowe informacje o kursie
              </motion.h2>

              <motion.p
                className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                {currentCourse.info_description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link
                  to={`/kursy/${getYearFromDate(
                    currentCourse.start_date || currentCourse.date_label
                  )}/${slugify(currentCourse.title)}/szczegoly`}
                  className="inline-flex items-center gap-2 bg-[#016ABA] hover:bg-[#0157A1] text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Przejdź do strony kursu
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14m-7-7l7 7-7 7"
                    />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </section>
        )}

        {/* === DLACZEGO WARTO === */}
        <section className="py-24 bg-sky-50 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.h2
              className="text-4xl font-bold mb-4 text-[#002C7C] dark:text-sky-400"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              Dlaczego warto wziąć udział w kursach CEEA?
            </motion.h2>

            <motion.span
              className="text-darkBlueGreen dark:text-sky-300 block max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              Jesteśmy pierwszym w Polsce ośrodkiem CEEA, który od 1995 roku
              wyszkolił dziesiątki polskich anestezjologów.
            </motion.span>

            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-10 mt-16">
              {[
                {
                  icon: "🤝",
                  title: "Wymiana doświadczeń między praktykami i ekspertami",
                  desc: "Każdorazowo w kursach CEEA uczestniczy grono kilkudziesięciu lekarzy – znakomitych ekspertów, doświadczonych praktyków a także początkujących rezydentów. Podczas wielu sesji wykładowych wywiązują się interesujące dyskusje i konfrontacje różnych doświadczeń i punktów widzenia.",
                },
                {
                  icon: "💡",
                  title:
                    "Aktualna wiedza medyczna oparta o EBM oraz doświadczenie",
                  desc: "Wierzymy, że u podstaw nowoczesnej anestezjologii i intensywnej terapii stoją dowody naukowe wskazujące na skuteczność naszego postępowania, dlatego przedstawiana wiedza opiera się na aktualnych wytycznych i rekomendacjach, uzupełniona praktycznymi wskazówkami budowanymi na latach doświadczeń klinicznych naszych wykładowców.",
                },
                {
                  icon: "🎓",
                  title: "Warsztaty praktyczne",
                  desc: "W programie bogatym w sesje teoretycznym musi znaleźć się miejsce na aspekt praktyczny. Podczas każdego kursu odbywa się spotkanie warsztatowe, np. poświęcone wykorzystaniu ultrasonografii w anestezji regionalnej wybranych okolic ciała. Z uwagi na ograniczone możliwości czasowe liczba miejsc na udział w warsztatach jest ograniczona.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="bg-white dark:bg-slate-800/70 backdrop-blur-sm p-10 rounded-3xl shadow-lg  transform hover:-translate-y-2 transition-all duration-300 border border-slate-200 dark:border-slate-700"
                  initial={{ opacity: 0, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                >
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-2xl font-semibold text-[#016ABA] dark:text-sky-400 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
      {/* Mobile: wyłącz ciężkie animacje blur (hero zabija wątek/GPU, menu muli) */}
      <style>{`
        @media (max-width: 1023px) {
          .hero-blob { animation: none !important; filter: blur(50px) !important; opacity: .22 !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-blob { animation: none !important; }
        }
      `}</style>
    </>
  )
}

// GraphQL zostaje TYLKO dla lokalnych plików (Home/ + onas3.jpg).
// allDatoCmsCourse / activeCourse / datoCmsDetailedInformationAboutTheCourse
// wyleciały – kursy idą z /courses.
export const query = graphql`
  query Home2ImageQuery {
    allFile(filter: { relativeDirectory: { eq: "Home" } }) {
      edges {
        node {
          name
          childImageSharp {
            gatsbyImageData(width: 800, placeholder: BLURRED)
          }
        }
      }
    }
    defaultImage: file(relativePath: { eq: "onas3.jpg" }) {
      childImageSharp {
        gatsbyImageData(width: 800, placeholder: BLURRED)
      }
    }
  }
`

export const Head = () => <Seo title="Strona główna — wariant hero" />

export default Home2Page