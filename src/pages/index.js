import * as React from "react"
import { useState, useEffect, Suspense } from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
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

const cld = (url, w) =>
  url && url.includes("res.cloudinary.com")
    ? url.replace("/upload/", `/upload/w_${w},q_auto,f_auto/`)
    : url

const API_URL = process.env.GATSBY_REGISTER_ENDPOINT

const HERITAGE = [
  {
    title: "Od 1995 roku",
    text: "Pierwszy ośrodek CEEA w Polsce — ciągłość kształcenia ustawicznego.",
  },
  {
    title: "Evidence Based Medicine",
    text: "Aktualne wytyczne i rekomendacje uzupełnione doświadczeniem klinicznym.",
  },
  {
    title: "Warsztaty praktyczne",
    text: "Sesje teoretyczne i spotkania warsztatowe w programie każdego kursu.",
  },
]

const PROCESS_STEPS = [
  {
    n: "01",
    accent: "#E8A317",
    title: "Wykłady i dyskusja",
    text: "Sesje z ekspertami i praktykami — konfrontacja doświadczeń w gronie lekarzy.",
  },
  {
    n: "02",
    accent: "#0077FF",
    title: "Warsztat praktyczny",
    text: "Aspekt praktyczny w programie (np. ultrasonografia) — ograniczona liczba miejsc.",
  },
  {
    n: "03",
    accent: "#00C896",
    title: "Skrypt / książka",
    text: "Podsumowanie kursu w pakiecie powitalnym — oferta także w sekcji Książki.",
  },
]

const WHY_ITEMS = [
  {
    key: "Collaborative_learning_environment",
    title: "Wymiana doświadczeń między praktykami i ekspertami",
    desc: "Każdorazowo w kursach CEEA uczestniczy grono kilkudziesięciu lekarzy – znakomitych ekspertów, doświadczonych praktyków a także początkujących rezydentów. Podczas wielu sesji wykładowych wywiązują się interesujące dyskusje i konfrontacje różnych doświadczeń i punktów widzenia.",
  },
  {
    key: "rozwoj-umiejetnosci",
    title: "Aktualna wiedza medyczna oparta o EBM oraz doświadczenie",
    desc: "Wierzymy, że u podstaw nowoczesnej anestezjologii i intensywnej terapii stoją dowody naukowe wskazujące na skuteczność naszego postępowania, dlatego przedstawiana wiedza opiera się na aktualnych wytycznych i rekomendacjach, uzupełniona praktycznymi wskazówkami budowanymi na latach doświadczeń klinicznych naszych wykładowców.",
  },
  {
    key: "Creativity_and_innovation",
    title: "Warsztaty praktyczne",
    desc: "W programie bogatym w sesje teoretyczne musi znaleźć się miejsce na aspekt praktyczny. Podczas każdego kursu odbywa się spotkanie warsztatowe, np. poświęcone wykorzystaniu ultrasonografii w anestezji regionalnej wybranych okolic ciała. Z uwagi na ograniczone możliwości czasowe liczba miejsc na udział w warsztatach jest ograniczona.",
  },
]

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

  const homeImages = Object.fromEntries(
    (data.allFile?.edges || []).map(({ node }) => [
      node.name,
      getImage(node.childImageSharp),
    ])
  )

  return (
    <>
      <div className="overflow-x-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-gray-100">
        <HeroParallax
          currentCourse={currentCourse}
          websiteRegister={websiteRegister}
          defaultImage={data.defaultImage}
          
        />

        {/* Heritage strip */}
        <section
          className="overflow-x-hidden bg-[#F7F4EF] dark:bg-slate-900 px-4 sm:px-6 lg:px-8 py-8 sm:py-10"
          aria-label="Ośrodek CEEA"
        >
          <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">
            {HERITAGE.map(item => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_12px_28px_rgba(11,31,58,0.08),0_2px_0_rgba(232,163,23,0.35)] dark:border-slate-700 dark:bg-slate-800 dark:shadow-none"
                style={{ transform: "perspective(700px) rotateX(1.5deg)" }}
              >
                <h2 className="font-bold text-[#002C7C] dark:text-sky-300 text-base">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Nadchodzące kursy — CSS 3D tilt */}
        <section className="overflow-x-hidden bg-slate-100 py-16 sm:py-24 dark:bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
            <h2 className="mb-10 sm:mb-12 text-3xl sm:text-4xl font-bold text-[#002C7C] dark:text-sky-300">
              Nadchodzące kursy i szkolenia
            </h2>
            <div
              className={`grid gap-8 ${
                futureCourses.length === 1
                  ? "grid-cols-1 max-w-xl mx-auto"
                  : futureCourses.length === 2
                  ? "md:grid-cols-2"
                  : "md:grid-cols-2 lg:grid-cols-3"
              }`}
              style={{ perspective: "1000px" }}
            >
              {futureCourses.map((course, i) => (
                <motion.article
                  key={course.course_id}
                  className="group w-full overflow-hidden rounded-3xl bg-white text-left shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-slate-800"
                  style={{ transformStyle: "preserve-3d" }}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.55, delay: i * 0.12 }}
                  whileHover={{ rotateY: -3 }}
                >
                  {course.image_url ? (
                    <img
                      src={cld(course.image_url, 600)}
                      alt={course.title}
                      className="h-52 w-full object-cover sm:h-56"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-52 w-full items-center justify-center bg-gradient-to-br from-[#016ABA] to-[#00C896] sm:h-56">
                      <span className="text-5xl font-bold text-white">
                        {(course.title || "C").charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="p-5 sm:p-6">
                    <h3 className="mb-4 min-h-[3rem] text-xl font-semibold text-[#016ABA] dark:text-sky-400 line-clamp-2">
                      {course.title}
                    </h3>
                    <dl className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      <div>
                        <dt className="inline font-semibold text-[#0B1F3A] dark:text-sky-200">
                          Numer:
                        </dt>{" "}
                        <dd className="inline">
                          {course?.course_number ?? "Brak numeru"}
                        </dd>
                      </div>
                      <div>
                        <dt className="inline font-semibold text-[#0B1F3A] dark:text-sky-200">
                          Data:
                        </dt>{" "}
                        <dd className="inline">
                          {course?.date_label || "Data wkrótce"}
                        </dd>
                      </div>
                      <div>
                        <dt className="inline font-semibold text-[#0B1F3A] dark:text-sky-200">
                          Język:
                        </dt>{" "}
                        <dd className="inline">
                          {course?.language === "en" ? "EN" : "PL"}
                        </dd>
                      </div>
                      <div>
                        <dt className="inline font-semibold text-[#0B1F3A] dark:text-sky-200">
                          Tryb:
                        </dt>{" "}
                        <dd className="inline">
                          {course?.is_online ? "Online" : "Stacjonarny"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Pas CTA */}
        {currentCourse?.available && (
          <section className="relative overflow-hidden px-4 py-16 sm:py-20 text-center text-white">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 18% 30%, rgba(232,163,23,0.28), transparent 42%), radial-gradient(circle at 88% 70%, rgba(0,200,150,0.28), transparent 45%), linear-gradient(120deg, #0b1f3a 0%, #0c6478 55%, #023e8a 100%)",
              }}
              aria-hidden="true"
            />
            <div className="relative mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold">Kurs już dostępny</h2>
              <p className="mt-4 text-lg text-white/90">
                Rejestracja otwarta! Zdobądź praktyczną wiedzę, doświadczenie i
                certyfikat CEEA.
              </p>
              <Link
                to={websiteRegister}
                className="mt-8 inline-flex rounded-xl bg-white px-8 py-3.5 font-semibold text-[#016ABA] shadow-[0_12px_30px_rgba(0,0,0,0.28),0_0_0_1px_rgba(232,163,23,0.4)] transition hover:scale-[1.03]"
              >
                Zarejestruj się teraz
              </Link>
            </div>
          </section>
        )}

        <Suspense fallback={null}>
          <SponsorsSection />
        </Suspense>

        {currentCourse?.available && !!currentCourse?.info_description && (
          <section className="relative overflow-hidden bg-[#F7F4EF] py-16 sm:py-24 text-center dark:bg-slate-900">
            <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
              <h2 className="mb-8 text-3xl font-bold text-[#002C7C] dark:text-sky-300">
                Dodatkowe informacje o kursie
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                {currentCourse.info_description}
              </p>
              <Link
                to={`/kursy/${getYearFromDate(
                  currentCourse.start_date || currentCourse.date_label
                )}/${slugify(currentCourse.title)}/szczegoly`}
                className="inline-flex items-center gap-2 rounded-full bg-[#016ABA] px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-[#0157A1]"
              >
                Przejdź do strony kursu
              </Link>
            </div>
          </section>
        )}

        {/* Jak wygląda kurs */}
        <section className="bg-white py-16 sm:py-24 dark:bg-slate-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="text-center text-3xl sm:text-4xl font-bold text-[#002C7C] dark:text-sky-300">
              Jak wygląda kurs CEEA
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600 dark:text-slate-300">
              Trzy warstwy programu — układ istniejącego charakteru szkoleń.
            </p>
            <div
              className="mt-12 grid gap-6 md:grid-cols-3"
              style={{ perspective: "1100px" }}
            >
              {PROCESS_STEPS.map((step, i) => (
                <motion.div
                  key={step.n}
                  className="rounded-2xl border border-slate-200 bg-[#F7F4EF] p-6 sm:p-7 dark:border-slate-700 dark:bg-slate-900"
                  style={{
                    borderTop: `3px solid ${step.accent}`,
                    boxShadow:
                      i === 1
                        ? "-8px 20px 0 rgba(11,31,58,0.06), 0 22px 40px rgba(11,31,58,0.1)"
                        : "-12px 16px 0 rgba(11,31,58,0.05), 0 18px 36px rgba(11,31,58,0.08)",
                    transform:
                      i === 0
                        ? "rotateY(-5deg)"
                        : i === 2
                        ? "rotateY(5deg)"
                        : "translateY(-8px)",
                  }}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div
                    className="text-2xl font-extrabold"
                    style={{ color: step.accent }}
                  >
                    {step.n}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-[#0B1F3A] dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {step.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Dlaczego CEEA — zdjęcia zamiast emoji */}
        <section className="bg-[#F7F4EF] py-16 sm:py-24 dark:bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#002C7C] dark:text-sky-300">
              Dlaczego warto wziąć udział w kursach CEEA?
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-slate-600 dark:text-slate-300">
              Jesteśmy pierwszym w Polsce ośrodkiem CEEA, który od 1995 roku
              wyszkolił dziesiątki polskich anestezjologów.
            </p>
            <div className="mt-14 grid gap-8 lg:grid-cols-3">
              {WHY_ITEMS.map((item, i) => {
                const img = homeImages[item.key]
                return (
                  <motion.article
                    key={item.title}
                    className="overflow-hidden rounded-2xl bg-white text-left shadow-[0_18px_40px_rgba(11,31,58,0.1)] dark:bg-slate-800"
                    style={{ transform: "perspective(900px) rotateX(2deg)" }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                    whileHover={{ y: -8, rotateX: 0 }}
                  >
                    {img ? (
                      <GatsbyImage
                        image={img}
                        alt={item.title}
                        className="h-44 w-full"
                        imgClassName="object-cover"
                      />
                    ) : (
                      <div className="h-44 w-full bg-gradient-to-br from-[#016ABA] to-[#00C896]" />
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[#016ABA] dark:text-sky-400">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {item.desc}
                      </p>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </section>

        {/* Mostek książki */}
        <section className="bg-white py-14 sm:py-20 dark:bg-slate-950">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div
              className="rounded-3xl border border-slate-200 bg-gradient-to-br from-[#F7F4EF] via-white to-[#e8f6f2] p-8 sm:p-10 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
              style={{
                transform: "perspective(900px) rotateX(1deg)",
                boxShadow:
                  "0 20px 50px rgba(11,31,58,0.1), 0 2px 0 rgba(232,163,23,0.35)",
              }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#E8A317]">
                Skrypty CEEA
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#002C7C] dark:text-sky-300">
                Książki i materiały z kursów
              </h2>
              <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300 leading-relaxed">
                Niezmiennie od wielu lat każdy kurs CEEA znajduje swoje
                podsumowanie pod postacią skryptu, który otrzymuje każdy
                uczestnik w ramach pakietu powitalnego. Jeśli są Państwo
                zainteresowani nabyciem naszych książek, zapraszamy do kontaktu.
              </p>
              <Link
                to="/ksiazki/"
                className="mt-6 inline-flex rounded-full bg-[#0B1F3A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#002C7C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
              >
                Przejdź do książek
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

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

export const Head = () => <Seo title="Strona główna" />

export default Home2Page
