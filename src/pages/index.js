import * as React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { graphql } from "gatsby"
import Img from "gatsby-image"
import Seo from "../components/seo"
import Title from "../components/Title/Title"
import Button from "../components/Button/Button"
import Box from "../components/Box/Box"
import Paragraph from "../components/Paragraph/Paragraph"
import { slugify } from "../utils/slugify"
import { AcademicCapIcon, BookOpenIcon } from "@heroicons/react/24/outline"
import { getYearFromDate } from "../utils/getYearFromDate"
import { motion } from "framer-motion"
import { Link } from "gatsby"

const IndexPage = ({ data }) => {
  const image1 = data.allFile.edges.find(
    edge => edge.node.name === "Collaborative_learning_environment"
  ).node.childImageSharp.fluid
  const image2 = data.allFile.edges.find(
    edge => edge.node.name === "rozwoj-umiejetnosci"
  ).node.childImageSharp.fluid
  const image3 = data.allFile.edges.find(
    edge => edge.node.name === "Creativity_and_innovation"
  ).node.childImageSharp.fluid

  const currentCourse = data.allDatoCmsCourse.nodes.find(
    c => c.available === true
  )
  const futureCourses = data.allDatoCmsCourse.nodes
    .filter(c => c.nextCourse === true)
    .slice(0, 3)

  const sponsors = data.datoCmsSponsor.sponsor
  const websiteRegister = `/kursy/${getYearFromDate(
    data.allDatoCmsCourse.nodes[0].date
  )}/${slugify(data.allDatoCmsCourse.nodes[0].nameCourse)}/rejestracja`

  return (
    <>
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-gray-100">
        {/* === HERO SECTION === */}
        <section className="relative min-h-[calc(100vh-7rem)] w-full flex items-center overflow-hidden">
  {/* 🔹 GatsbyImage jako tło */}
  {currentCourse?.backgroundimage?.gatsbyImageData && (
    <GatsbyImage
      image={getImage(currentCourse.backgroundimage)}
      alt={currentCourse.nameCourse || "Tło kursu"}
      className="absolute inset-0 w-full h-full"
      style={{ filter: "brightness(0.7)", objectFit: "cover" }}
    />
  )}

  {/* 🔹 Opcjonalna ciemna nakładka */}
  <div className="absolute inset-0 bg-black/40 dark:bg-black/50"></div>

  {/* 🔹 Dekoracyjna fala SVG */}
  <svg
    className="absolute bottom-0 left-0 w-full"
    viewBox="0 0 1430 300"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="headerWaveLight" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F1F5F9" />
        <stop offset="100%" stopColor="#F1F5F9" />
      </linearGradient>
      <linearGradient id="headerWaveDark" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#10172A" />
        <stop offset="100%" stopColor="#10172A" />
      </linearGradient>
    </defs>
    <path
      d="M0,224L60,197.3C120,171,240,117,360,122.7C480,128,600,192,720,208C840,224,960,192,1080,197.3C1200,203,1320,245,1380,266.7L1440,288V320H0Z"
      fill="url(#headerWaveLight)"
      className="dark:fill-[url(#headerWaveDark)]"
    />
  </svg>

  {/* 🔹 Zawartość */}
  <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 items-center px-6 space-y-6">
    {/* Lewa kolumna: tekst */}
    <motion.div
      className="col-span-6 text-white space-y-6"
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="inline-block bg-[#00C896] dark:bg-[#00A07A] text-white text-sm font-semibold tracking-wider uppercase py-2 px-4 rounded-full shadow-lg dark:shadow-xl transition-colors duration-300">
        Kurs już dostępny
      </div>
      <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-xl mt-6">
        {currentCourse?.nameCourse || "Centrum Edukacji CEEA"}
      </h1>
      <p className="text-lg text-gray-100 font-medium mt-4 drop-shadow-md">
        {currentCourse?.date
          ? `Data kursu: ${currentCourse.date}`
          : "Nowa edycja kursów CEEA już wkrótce!"}
      </p>
      <p className="text-gray-200 max-w-xl mx-auto leading-relaxed text-lg mt-6 drop-shadow-md">
        {currentCourse?.description2 ||
          "Dołącz do najnowszej edycji naszego kursu CEEA i rozwijaj swoje kompetencje w nowoczesny, praktyczny sposób. Wiedza, doświadczenie i inspiracja w jednym miejscu."}
      </p>
      {currentCourse && (
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link
            to={websiteRegister}
            className="inline-flex items-center mt-20 gap-3 bg-gradient-to-r from-[#0077FF] to-[#00C6FF] text-white font-bold py-4 px-8 rounded-full shadow-[0_10px_40px_rgba(0,123,255,0.4)] hover:shadow-[0_15px_50px_rgba(0,123,255,0.6)] transition-all duration-300 text-lg dark:from-[#3fa7d6] dark:to-[#257ca3] dark:hover:from-[#257ca3] dark:hover:to-[#3fa7d6] dark:shadow-[#1e293b]/60"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
            </svg>
            Zapisz się na kurs
          </Link>
        </motion.div>
      )}
    </motion.div>

    {/* Prawa kolumna: obrazek kursu */}
    <motion.div
      className="col-span-6 relative max-lg:hidden"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="relative group"
        whileHover={{ rotateY: 8, rotateX: -3, scale: 1.03 }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
      >
        <Img
          fluid={
            currentCourse?.image?.fluid || data.defaultImage.childImageSharp.fluid
          }
          alt={currentCourse?.nameCourse || "CEEA kurs"}
          className="rounded-[2.5rem] shadow-2xl border border-white/20 object-cover w-full"
        />
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-t from-black/30 to-transparent"></div>
      </motion.div>
    </motion.div>
  </div>
</section>

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
          futureCourses.length <= 2
            ? "md:grid-cols-2 sm:grid-col-1 justify-items-center"
            : "md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1"
        } 
      `}
            >
              {futureCourses.map((course, i) => (
                <motion.div
                  key={course.id}
                  className="bg-white dark:bg-slate-700 rounded-3xl shadow-lg hover:shadow-2xl w-full"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.15,
                    ease: "easeOut",
                  }}
                >
                  <Img
                    fluid={
                      course.image?.fluid ||
                      data.defaultImage.childImageSharp.fluid
                    }
                    alt={course.nameCourse}
                    className="rounded-t-3xl h-56 object-cover"
                  />
                  <div className="p-6 text-left">
                    <h3 className="h-16 text-xl font-semibold text-[#016ABA] dark:text-sky-400 mb-3 line-clamp-2">
                      {course.nameCourse}
                    </h3>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                      <li className="flex items-center">
                        <span className="text-lg px-2">#️⃣</span>
                        <span>
                          Numer kursu:{" "}
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {course?.numerCourse || "Brak numeru"}
                          </span>
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-lg px-2">📅</span>
                        <span>
                          Data:{" "}
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {course?.date || "Data wkrótce"}
                          </span>
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-lg px-2">⏳</span>
                        <span>
                          {course?.duration ? (
                            <>
                              Czas trwania:{" "}
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {course.duration}
                              </span>
                            </>
                          ) : (
                            "Czas trwania wkrótce"
                          )}
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-lg px-2">🌐</span>
                        <span>
                          Język:{" "}
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {course?.language === true ? "PL" : "EN"}
                          </span>
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-lg px-2">🖥</span>
                        <span>
                          Tryb:{" "}
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {course.type ||
                              (course?.online ? "Online" : "Stacjonarny")}
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
        <section className="bg-[#016ABA] dark:bg-sky-900 py-20 text-white">
          <div className="max-w-6xl mx-auto text-center px-6">
            <motion.h2
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              {currentCourse
                ? "Kurs już dostępny"
                : "Najbliższy kurs już wkrótce!"}
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

        {/* === SPONSORZY === */}
        <section className="py-24 bg-gray-50 dark:bg-slate-800">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.h2
              className="text-3xl font-bold mb-12 text-[#002C7C] dark:text-sky-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              Nasi sponsorzy i partnerzy
            </motion.h2>

            <div
              className={`grid gap-8 items-center justify-center opacity-80
      ${sponsors.length === 1 ? "grid-cols-1" : ""}
      ${sponsors.length === 2 ? "grid-cols-2 place-content-center" : ""}
      ${sponsors.length >= 3 ? "grid-cols-2 md:grid-cols-4" : ""}
      `}
            >
              {sponsors.map((sponsor, idx) => {
                const image = getImage(sponsor.gatsbyImageData)
                const website = sponsor?.customData?.stronaInternetowa

                const content = (
                  <GatsbyImage
                    image={image}
                    alt={sponsor.title || `Sponsor ${idx + 1}`}
                    className={`h-auto max-h-36 w-auto max-w-full object-contain mx-auto transition-all duration-300
            dark:invert dark:brightness-125 dark:contrast-125`}
                    style={{ filter: "invert(0%)" }}
                  />
                )

                return (
                  <motion.div
                    key={idx}
                    className="p-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {website ? (
                      <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Odwiedź stronę sponsora ${
                          sponsor.title || ""
                        }`}
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {data.datoCmsDetailedInformationAboutTheCourse && (
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
                {currentCourse.additionalInfo ||
                  "Więcej szczegółowych informacji o tym kursie znajdziesz na stronie poświęconej danej edycji."}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link
                  to={`/kursy/${getYearFromDate(
                    data.activeCourse.nodes[0].date
                  )}/${slugify(
                    data.activeCourse.nodes[0].nameCourse
                  )}/szczegoly`}
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

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mt-16">
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
                  className="bg-white dark:bg-slate-800/70 backdrop-blur-sm p-10 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-slate-200 dark:border-slate-700"
                  initial={{ opacity: 0, y: 30 }}
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

      {/* <div className=" text-slate-900 dark:bg-slate-900 dark:text-gray-100 min-h-screen">
        <div className="mx-auto max-w-6xl bg-white grid lg:grid-cols-12 max-lg:grid-cols-1 px-6 py-36 w-full h-full items-center justify-between gap-x-10 dark:bg-gray-800 ">
          <div className="max-w-xl col-span-6">
            <Title tag="h1">
              Serdecznie zapraszamy do udziału w kolejnym kursie
              <span className="text-[#002C7C] pl-3 font-bold">C</span>
              <span className="text-[#016ABA] font-bold">E</span>
              <span className="text-[#47AEE6] font-bold">E</span>
              <span className="text-[#88C8EB] font-bold">A</span>
            </Title>
            <Paragraph>
              {data.datoCmsMainsite.paragraph ||
                "Ośrodek Poznański CEEA już od niespełna 30 lat organizuje kursy dla lekarzy specjalistów oraz lekarzy rezydentów anestezjologii i intensywnej terapii. Dzięki udziałowi w naszych cyklach kursów mają Państwo możliwość udziału w wykładach prowadzonych przez ekspertów w dziedzinie anestezjologii i intensywnej terapii, aktualizacji wiedzy medycznej w oparciu o Evidence Based Medicine oraz dyskusji w gronie praktyków, w której przeniesiemy wiedzę teoretyczną na realia naszej codziennej pracy, niejednokrotnie obfite w wyzwania organizacyjne."}
            </Paragraph>
            {data.allDatoCmsCourse.nodes
              .filter(course => course.available === true)
              .map(course => (
                <>
                  <Button
                    key={course.id}
                    variant="default"
                    href={`/kursy/${getYearFromDate(
                      data.allDatoCmsCourse.nodes[0].date
                    )}/${slugify(
                      data.allDatoCmsCourse.nodes[0].nameCourse
                    )}/rejestracja`}
                  >
                    Zapisz się na kurs
                  </Button>
                </>
              ))}
          </div>

          <div className="w-full lg:h-500 max-lg:hidden px-8 col-span-6">
            {data.allDatoCmsCourse.nodes.filter(
              course => course.available === true
            ).length > 0 ? (
              data.allDatoCmsCourse.nodes
                .filter(course => course.available === true) // Filtrujemy kursy z available === true
                .map(course => (
                  <Img
                    key={course.id}
                    fluid={
                      course.image?.fluid ||
                      data.defaultImage.childImageSharp.fluid
                    }
                    className="rounded-3xl w-full h-full object-cover"
                    alt={course.nameCourse}
                    loading="eager"
                  />
                ))
            ) : (
              <Img
                fluid={data.defaultImage.childImageSharp.fluid}
                className="rounded-3xl w-full h-full object-cover"
                alt="Default"
                loading="eager"
              />
            )}
          </div>
        </div>
      </div>

      <div className="w-full bg-vividTurquoise flex py-14 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl flex max-xl:flex-col items-center px-7 max-xl:text-center">
          <div className="max-w-xl xl:mr-10 max-xl:mb-10">
            <Title tag="h2" white>
              Kształcenie ustawiczne w anestezjologii i intensywnej terapii
            </Title>
          </div>
          <div className="flex text-white">
            <div className="flex max-sm:flex-col items-center pr-4 ">
              <div className="bg-darker p-3 rounded-full">
                <BookOpenIcon className="w-10 h-10 max-md:w-7 max-md:h-7 object-cover" />
              </div>
              <span className="md:px-3 max-md:px-2 max-md:text-base max-sm:py-3">
                Kompleksowe kursy
              </span>
            </div>
            <div className="flex items-center max-sm:flex-col">
              <div className="bg-darker p-3 rounded-full">
                <AcademicCapIcon className="w-10 h-10 max-md:w-7 max-md:h-7 object-cover" />
              </div>
              <span className="md:px-3 max-md:px-2 max-md:text-base max-sm:py-3">
                Obszerna biblioteka
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-darkBlueGreen py-36 dark:bg-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <Title tag="h2" className="text-center text-white">
              Sprawdź daty nadchodzących kursów i szkoleń
            </Title>
          </div>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
            {data.allDatoCmsCourse.nodes
              .filter(course => course.nextCourse === true) // Filtruje kursy
              .sort((a, b) => {
                const parseDate = dateString => {
                  // Sprawdź, czy jest to tylko rok
                  if (/^\d{4}$/.test(dateString)) {
                    return { year: parseInt(dateString, 10), month: 0 }
                  }

                  // Sprawdź, czy jest to zakres dat, np. "23-25.05.2024"
                  const match = dateString.match(
                    /(\d{1,2})[-.]?(\d{1,2})?[-.]?(\d{4})/
                  )
                  if (match) {
                    return {
                      year: parseInt(match[3], 10),
                      month: parseInt(match[2] || "1", 10) - 1, // Domyślnie styczeń
                    }
                  }

                  // Jeśli nie pasuje, zwróć null
                  return null
                }

                const dateA = parseDate(a.date)
                const dateB = parseDate(b.date)

                if (!dateA || !dateB) {
                  return 0 // Jeśli którejś daty brakuje, nie zmieniaj kolejności
                }

                // Najpierw sortuj po roku, a potem po miesiącu
                return dateA.year - dateB.year || dateA.month - dateB.month
              })
              .slice(0, 2) // Pobierz maksymalnie dwa kursy
              .map((course, index) => (
                <div
                  key={course.id}
                  className="bg-white shadow-md rounded-lg overflow-hidden ease-in-out transform lg:hover:scale-105 transition duration-500"
                >
                  <div className="relative">
                    <Img
                      fluid={
                        course.image?.fluid ||
                        data.defaultImage.childImageSharp.fluid
                      }
                      alt={course?.nameCourse}
                      className="h-56 w-full object-cover"
                    />
                    {course.newCourse && (
                      <span className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-lg">
                        Nowość
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-darkBlueGreen mb-4 leading-snug">
                      {course?.nameCourse}
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>
                        <span className="text-lg px-2">#️⃣</span>
                        Numer kursu: {course?.numerCourse || "Brak numeru"}
                      </li>
                      <li>
                        <span className="text-lg px-2">📅</span>
                        Data: {course?.date || "Data wkrótce"}
                      </li>
                      <li>
                        <span className="text-lg px-2">⏳</span>

                        {course?.duration
                          ? `Czas trwania: ${course.duration}`
                          : "Czas trwania wkrótce"}
                      </li>
                      <li>
                        <span className="text-lg px-2">🌐</span>
                        Język: {course?.language === true ? "PL" : "EN"}
                      </li>
                      <li>
                        <span className="text-lg px-2">🖥</span>
                        Tryb:{" "}
                        {course.type ||
                          (course?.online ? "Online" : "Stacjonarny")}
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="w-full bg-white dark:bg-gray-800 z-0">
        <div className="max-auto flex flex-col items-center px-6 py-32 ">
          <div className="text-center grid gap-4">
            <Title tag="h2" className="text-darkBlueGreen">
              Dlaczego warto wziąć udział w kursach CEEA?
            </Title>
            <span className="text-darkBlueGreen">
              Jesteśmy pierwszym w Polsce ośrodkiem CEEA, który od 1995 roku
              wyszkolił dziesiątki polskich anestezjologów.
            </span>
          </div>
          <div className="max-w-6xl py-10 grid grid-flow-row lg:grid-cols-3 max-lg:grid-cols-1 max-lg:w-full gap-x-12 gap-y-8  mt-10">
            <Box
              image={image1}
              title="Wymiana doświadczeń między praktykami i ekspertami"
              description="Każdorazowo w kursach CEEA uczestniczy grono kilkudziesięciu lekarzy – znakomitych ekspertów, doświadczonych praktyków a także początkujących rezydentów. Podczas wielu sesji wykładowych wywiązują się interesujące dyskusje i konfrontacje różnych doświadczeń i punktów widzenia.
              "
            />
            <Box
              image={image2}
              title="Aktualna wiedza medyczna oparta o EBM oraz doświadczenie"
              description="Wierzymy, że u podstaw nowoczesnej anestezjologii i intensywnej terapii stoją dowody naukowe wskazujące na skuteczność naszego postępowania, dlatego przedstawiana wiedza opiera się na aktualnych wytycznych i rekomendacjach, uzupełniona praktycznymi wskazówkami budowanymi na latach doświadczeń klinicznych naszych wykładowców.
              "
            />
            <Box
              image={image3}
              title="Warsztaty praktyczne"
              description="W programie bogatym w sesje teoretycznym musi znaleźć się miejsce na aspekt praktyczny. Podczas każdego kursu odbywa się spotkanie warsztatowe, np. poświęcone wykorzystaniu ultrasonografii w anestezji regionalnej wybranych okolic ciała. Z uwagi na ograniczone możliwości czasowe liczba miejsc na udział w warsztatach jest ograniczona.
              "
            />
          </div>
        </div>
      </div> */}
    </>
  )
}

export const query = graphql`
  query ImageQuery {
    allDatoCmsCourse {
      nodes {
        id
        numerCourse
        nameCourse
        nextCourse
        newCourse
        description2
        online
        language
        date
        available
        backgroundimage {
          gatsbyImageData(width: 1600, placeholder: BLURRED)
        }
        image {
          fluid(maxWidth: 800) {
            ...GatsbyDatoCmsFluid
          }
        }
      }
    }
    activeCourse: allDatoCmsCourse(filter: { available: { eq: true } }) {
      nodes {
        id
        date
        nameCourse
        backgroundimage {
          fluid(maxWidth: 800) {
            ...GatsbyDatoCmsFluid
          }
        }
      }
    }

    allFile(filter: { relativeDirectory: { eq: "Home" } }) {
      edges {
        node {
          name
          childImageSharp {
            fluid(maxWidth: 800) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
    defaultImage: file(relativePath: { eq: "onas3.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 800) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    datoCmsMainsite {
      paragraph
    }
    datoCmsSponsor {
      sponsor {
        title
        gatsbyImageData(width: 400, placeholder: BLURRED)
        customData
      }
    }
    datoCmsDetailedInformationAboutTheCourse {
      id
    }
  }
`

export const Head = () => <Seo title="Strona główna" />

export default IndexPage
