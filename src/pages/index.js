import * as React from "react"
import { Suspense } from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { graphql } from "gatsby"
import Seo from "../components/seo"
import { slugify } from "../utils/slugify"
import { getYearFromDate } from "../utils/getYearFromDate"
import { motion } from "framer-motion"
import { Link } from "gatsby"
import HeroParallax from "../components/Hero/HeroParallax"
import { useHomeCourses } from "../context/HomeCoursesContext"
import { menuLinks } from "../components/Menu"

const SponsorsSection = React.lazy(() =>
  import("../components/Sponsors/SponsorsSection")
)

const cld = (url, w) =>
  url && url.includes("res.cloudinary.com")
    ? url.replace("/upload/", `/upload/w_${w},q_auto,f_auto/`)
    : url

const TRUST_LINE =
  "Pierwszy ośrodek CEEA w Polsce · od 1995 · EBM · warsztaty praktyczne"

const PROCESS_STEPS = [
  {
    n: "01",
    title: "Wykłady i dyskusja",
    text: "Sesje z ekspertami i praktykami — konfrontacja doświadczeń w gronie lekarzy.",
  },
  {
    n: "02",
    title: "Warsztat praktyczny",
    text: "Aspekt praktyczny w programie (np. ultrasonografia) — ograniczona liczba miejsc.",
  },
  {
    n: "03",
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

const booksCopy =
  menuLinks.find(l => l.to === "/ksiazki/")?.description ||
  "Niezmiennie od wielu lat każdy kurs CEEA znajduje swoje podsumowanie pod postacią skryptu, który otrzymuje każdy uczestnik kursu w ramach pakietu powitalnego. Jeśli są Państwo zainteresowani nabyciem naszych książek zapraszamy do kontaktu."

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
}

const IndexPage = ({ data }) => {
  const {
    courses,
    activeCourse: currentCourse,
    ready: coursesReady,
  } = useHomeCourses()

  const futureCourses = courses.filter(c => c.is_next === true).slice(0, 3)

  const regCourse = currentCourse || courses[0]
  const websiteRegister = regCourse
    ? `/kursy/${getYearFromDate(
        regCourse.start_date || regCourse.date_label
      )}/${slugify(regCourse.title)}/rejestracja`
    : "#"

  const courseDetailsPath =
    currentCourse &&
    `/kursy/${getYearFromDate(
      currentCourse.start_date || currentCourse.date_label
    )}/${slugify(currentCourse.title)}/szczegoly`

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
          coursesReady={coursesReady}
        />

        {/* Linia zaufania — typografia, bez kart */}
        <section
          className="border-y border-slate-200/80 bg-slate-50 px-4 py-5 sm:px-6 sm:py-6 dark:border-slate-700 dark:bg-slate-950"
          aria-label="Ośrodek CEEA"
        >
          <p className="mx-auto max-w-7xl text-center text-sm font-medium tracking-wide text-[#0B1F3A] sm:text-base dark:text-sky-200">
            <span
              className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#E8A317] align-middle"
              aria-hidden="true"
            />
            {TRUST_LINE}
          </p>
        </section>

        {/* Nadchodzące kursy */}
        <section className="overflow-x-hidden bg-white py-16 sm:py-24 dark:bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
            <motion.h2
              className="mb-10 text-3xl font-bold text-[#0B1F3A] sm:mb-12 sm:text-4xl dark:text-sky-300"
              {...fadeUp}
              transition={{ duration: 0.45 }}
            >
              Nadchodzące kursy i szkolenia
            </motion.h2>
            {futureCourses.length === 0 ? (
              <div className="mx-auto max-w-md">
                <Link
                  to="/kursy/"
                  className="inline-flex rounded-xl bg-gradient-to-r from-[#0077FF] to-[#00C6FF] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-105"
                >
                  Zobacz wszystkie kursy
                </Link>
              </div>
            ) : (
              <div
                className={`grid gap-8 ${
                  futureCourses.length === 1
                    ? "mx-auto max-w-xl grid-cols-1"
                    : futureCourses.length === 2
                    ? "md:grid-cols-2"
                    : "md:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {futureCourses.map((course, i) => (
                  <motion.article
                    key={course.course_id}
                    className="group w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white text-left shadow-sm transition duration-300 dark:border-slate-700 dark:bg-slate-800 lg:hover:-translate-y-1 lg:hover:shadow-lg"
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    {course.image_url ? (
                      <img
                        src={cld(course.image_url, 600)}
                        alt={course.title}
                        className="h-52 w-full object-cover sm:h-56"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-52 w-full items-center justify-center bg-gradient-to-br from-[#0B1F3A] to-[#0077FF] sm:h-56">
                        <span className="text-5xl font-bold text-white">
                          {(course.title || "C").charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="p-5 sm:p-6">
                      <h3 className="mb-4 min-h-[3rem] text-xl font-semibold text-[#002C7C] line-clamp-2 dark:text-sky-400">
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
            )}
          </div>
        </section>

        {/* Dlaczego CEEA — editorial + mini-proces */}
        <section className="bg-slate-50 py-16 sm:py-24 dark:bg-slate-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <motion.h2
                className="text-3xl font-bold text-[#0B1F3A] sm:text-4xl dark:text-sky-300"
                {...fadeUp}
                transition={{ duration: 0.45 }}
              >
                Dlaczego warto wziąć udział w kursach CEEA?
              </motion.h2>
              <motion.p
                className="mt-4 text-slate-600 dark:text-slate-300"
                {...fadeUp}
                transition={{ duration: 0.45, delay: 0.05 }}
              >
                Jesteśmy pierwszym w Polsce ośrodkiem CEEA, który od 1995 roku
                wyszkolił dziesiątki polskich anestezjologów.
              </motion.p>
            </div>

            <div className="mt-14 space-y-14 lg:space-y-20">
              {WHY_ITEMS.map((item, i) => {
                const img = homeImages[item.key]
                const reverse = i % 2 === 1
                return (
                  <motion.article
                    key={item.title}
                    className={`flex flex-col items-center gap-8 lg:gap-12 ${
                      reverse ? "lg:flex-row-reverse" : "lg:flex-row"
                    }`}
                    {...fadeUp}
                    transition={{ duration: 0.5, delay: 0.05 * i }}
                  >
                    <div className="w-full overflow-hidden rounded-2xl lg:w-1/2">
                      {img ? (
                        <GatsbyImage
                          image={img}
                          alt={item.title}
                          className="aspect-[16/10] w-full"
                          imgClassName="object-cover"
                        />
                      ) : (
                        <div className="aspect-[16/10] w-full bg-gradient-to-br from-[#0B1F3A] to-[#00C896]" />
                      )}
                    </div>
                    <div className="w-full text-left lg:w-1/2">
                      <h3 className="text-xl font-semibold text-[#002C7C] sm:text-2xl dark:text-sky-400">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                        {item.desc}
                      </p>
                    </div>
                  </motion.article>
                )
              })}
            </div>

            {/* Kompaktowy proces 01–03 */}
            <ol className="mt-16 grid gap-6 border-t border-slate-200 pt-12 sm:grid-cols-3 dark:border-slate-700">
              {PROCESS_STEPS.map((step, i) => (
                <motion.li
                  key={step.n}
                  className="text-left"
                  {...fadeUp}
                  transition={{ duration: 0.4, delay: 0.08 * i }}
                >
                  <span className="text-sm font-bold tracking-widest text-[#0077FF] dark:text-sky-400">
                    {step.n}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-[#0B1F3A] dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {step.text}
                  </p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* Band aktualnego kursu — scalony CTA + info */}
        {coursesReady && currentCourse?.available && (
          <section className="relative overflow-hidden px-4 py-16 text-white sm:px-6 sm:py-20">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 12% 20%, rgba(232,163,23,0.22), transparent 40%), linear-gradient(125deg, #0B1F3A 0%, #0c6478 52%, #023e8a 100%)",
              }}
              aria-hidden="true"
            />
            <div className="relative mx-auto max-w-3xl text-center">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#00C896]">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-[#00C896]"
                  aria-hidden="true"
                />
                Dostępny
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Kurs już dostępny
              </h2>
              {currentCourse?.title && (
                <p className="mt-3 text-lg font-medium text-white/95">
                  {currentCourse.title}
                </p>
              )}
              {!!currentCourse?.info_description && (
                <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/85">
                  {currentCourse.info_description}
                </p>
              )}
              {!currentCourse?.info_description && (
                <p className="mt-4 text-lg text-white/90">
                  Rejestracja otwarta! Zdobądź praktyczną wiedzę, doświadczenie i
                  certyfikat CEEA.
                </p>
              )}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to={websiteRegister}
                  className="inline-flex rounded-xl bg-gradient-to-r from-[#0077FF] to-[#00C6FF] px-8 py-3.5 font-semibold text-white shadow-lg transition hover:brightness-105"
                >
                  Zarejestruj się teraz
                </Link>
                {courseDetailsPath && (
                  <Link
                    to={courseDetailsPath}
                    className="inline-flex rounded-xl border border-white/50 bg-transparent px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
                  >
                    Szczegóły kursu
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}

        <Suspense fallback={null}>
          <SponsorsSection />
        </Suspense>

        {/* Mostek Książki + O nas */}
        <section className="bg-white py-16 sm:py-24 dark:bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <motion.h2
              className="text-center text-3xl font-bold text-[#0B1F3A] sm:text-4xl dark:text-sky-300"
              {...fadeUp}
              transition={{ duration: 0.45 }}
            >
              Dalej na stronie
            </motion.h2>
            <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-14">
              <motion.div
                className="text-left"
                {...fadeUp}
                transition={{ duration: 0.45, delay: 0.08 }}
              >
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#E8A317]">
                  Skrypty CEEA
                </p>
                <h3 className="mt-2 text-2xl font-bold text-[#002C7C] dark:text-sky-300">
                  Książki i materiały z kursów
                </h3>
                <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
                  {booksCopy}
                </p>
                <Link
                  to="/ksiazki/"
                  className="mt-6 inline-flex rounded-xl bg-[#0B1F3A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#002C7C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
                >
                  Przejdź do książek
                </Link>
              </motion.div>
              <motion.div
                className="border-t border-slate-200 pt-10 text-left md:border-l md:border-t-0 md:pl-14 md:pt-0 dark:border-slate-700"
                {...fadeUp}
                transition={{ duration: 0.45, delay: 0.12 }}
              >
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  O nas
                </p>
                <h3 className="mt-2 text-2xl font-bold text-[#002C7C] dark:text-sky-300">
                  Historia ośrodka
                </h3>
                <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
                  Ośrodek Poznański CEEA od 1995 roku organizuje kursy dla
                  lekarzy. Pierwszy ośrodek CEEA w Polsce — ciągłość kształcenia
                  ustawicznego.
                </p>
                <Link
                  to="/o-nas/"
                  className="mt-6 inline-flex text-sm font-semibold text-[#002C7C] underline-offset-4 transition hover:underline dark:text-sky-400"
                >
                  Historia ośrodka
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export const query = graphql`
  query HomePageImageQuery {
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

export const Head = ({ location }) => (
  <Seo
    title="CEEA Poznań – Kursy Anestezjologii i Medycyny Okołooperacyjnej"
    description="CEEA Poznań – Regionalne Centrum CEEA od 1995 roku. Kursy anestezjologii i medycyny okołooperacyjnej dla lekarzy specjalistów oraz rezydentów. Certyfikowane szkolenia CME."
    pathname={location?.pathname || "/"}
    absoluteTitle
    jsonLd={[
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://ceea.org.pl/#organization",
        name: "CEEA – Centrum Edukacji w Anestezjologii",
        alternateName: ["CEEA Poznań", "Regionalne Centrum CEEA w Poznaniu"],
        url: "https://ceea.org.pl/",
        logo: "https://ceea.org.pl/icons/icon-512x512.png",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Poznań",
          addressCountry: "PL",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://ceea.org.pl/#website",
        name: "CEEA Poznań",
        url: "https://ceea.org.pl/",
        inLanguage: "pl-PL",
        publisher: { "@id": "https://ceea.org.pl/#organization" },
      },
    ]}
  />
)

export default IndexPage
