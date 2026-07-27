import * as React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { graphql } from "gatsby"
import Seo from "../components/seo"
import { slugify } from "../utils/slugify"
import { getYearFromDate } from "../utils/getYearFromDate"
import { motion } from "framer-motion"
import { Link } from "gatsby"

const IndexPage = ({ data }) => {
  const image1 = data.allFile.edges.find(
    edge => edge.node.name === "Collaborative_learning_environment"
  )?.node?.childImageSharp?.fluid

  const image2 = data.allFile.edges.find(
    edge => edge.node.name === "rozwoj-umiejetnosci"
  )?.node?.childImageSharp?.fluid

  const image3 = data.allFile.edges.find(
    edge => edge.node.name === "Creativity_and_innovation"
  )?.node?.childImageSharp?.fluid

  const currentCourse = data.allDatoCmsCourse.nodes.find(
    c => c.available === true
  )
  const futureCourses = data.allDatoCmsCourse.nodes
    .filter(c => c.nextCourse === true)
    .slice(0, 3)

  const sponsors = data?.datoCmsSponsor?.sponsor || []
  const firstCourse = data?.allDatoCmsCourse?.nodes?.[0]

  const websiteRegister = firstCourse
    ? `/kursy/${getYearFromDate(firstCourse.date)}/${slugify(
        firstCourse.nameCourse
      )}/rejestracja`
    : "#"

  return (
    <>
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-gray-100">
        {/* === HERO SECTION === */}
        <section className="relative w-full overflow-hidden min-h-[100vh] xl:min-h-[105vh] lg:min-h-[100vh] max-sm:min-h-[70vh] sm:min-h-[70vh] md:min-h-[80vh]">
          {/* 🔹 GatsbyImage jako tło */}
          {currentCourse?.backgroundimage?.gatsbyImageData ? (
            <GatsbyImage
              image={getImage(currentCourse.backgroundimage)}
              alt={currentCourse.nameCourse || "Tło kursu"}
              className="absolute inset-0 w-full h-full"
              imgClassName="object-cover w-full h-full"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            />
          ) : (
            /* 🔹 Gradient mesh z ruchem - wersja działająca */
            <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0b1120]">
              {/* Gradient bazowy */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#0b1120] to-[#1e293b]" />

              {/* Blob 1 - niebieski, pływa w lewo-górę */}
              <div
                className="absolute w-[800px] h-[800px] rounded-full opacity-40 blur-[140px] animate-pulse"
                style={{
                  background:
                    "radial-gradient(circle, #0077FF 0%, transparent 70%)",
                  top: "-10%",
                  left: "-15%",
                  animation:
                    "pulse 4s ease-in-out infinite, float 20s ease-in-out infinite",
                }}
              />

              {/* Blob 2 - turkusowy, pływa w prawo-dół */}
              <div
                className="absolute w-[700px] h-[700px] rounded-full opacity-30 blur-[120px] animate-pulse"
                style={{
                  background:
                    "radial-gradient(circle, #00C6FF 0%, transparent 70%)",
                  bottom: "-15%",
                  right: "-10%",
                  animation:
                    "pulse 5s ease-in-out infinite, drift 25s ease-in-out infinite reverse",
                  animationDelay: "1s, 0s",
                }}
              />

              {/* Blob 3 - zielony, pływa centralnie */}
              <div
                className="absolute w-[600px] h-[600px] rounded-full opacity-25 blur-[100px] animate-pulse"
                style={{
                  background:
                    "radial-gradient(circle, #00C896 0%, transparent 70%)",
                  top: "40%",
                  left: "50%",
                  animation:
                    "pulse 6s ease-in-out infinite, drift 22s ease-in-out infinite",
                  animationDelay: "2s, 0s",
                }}
              />

              {/* Blob 4 - fioletowy akcent */}
              <div
                className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[110px] animate-pulse"
                style={{
                  background:
                    "radial-gradient(circle, #6366f1 0%, transparent 70%)",
                  top: "20%",
                  right: "30%",
                  animation:
                    "pulse 7s ease-in-out infinite, float 18s ease-in-out infinite",
                  animationDelay: "3s, 5s",
                }}
              />

              {/* Center glow - subtelne światło w centrum */}
              <div
                className="absolute w-[400px] h-[400px] rounded-full opacity-20 blur-[80px]"
                style={{
                  background:
                    "radial-gradient(circle, #38bdf8 0%, transparent 70%)",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  animation: "pulse-glow 8s ease-in-out infinite",
                }}
              />

              {/* Siatka dla struktury */}
              <div
                className="absolute inset-0 opacity-[0.025]"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Winietowanie - ciemniejsze brzegi */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%)",
                }}
              />
            </div>
          )}
          <div className="absolute inset-0 w-full h-full bg-black/40 dark:bg-black/50 "></div>
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
          <div className="relative z-10 max-w-7xl mx-auto px-6 min-h-[90vh] flex items-center">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
              {/* Lewa kolumna: tekst */}
              <motion.div
                className="lg:col-span-5 flex flex-col justify-center text-white space-y-6"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
              >
                {currentCourse?.available && (
                  <div className="flex">
                    <div className="inline-block bg-[#00C896] dark:bg-[#00A07A] text-white text-sm font-semibold tracking-wider uppercase py-2 px-4 rounded-full shadow-lg dark:shadow-xl transition-colors duration-300">
                      Kurs już dostępny
                    </div>
                  </div>
                )}

                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold leading-[1.1] drop-shadow-xl">
                  {currentCourse?.nameCourse || "Centrum Edukacji CEEA"}
                </h1>

                <p className="text-xl text-gray-100 font-medium drop-shadow-md">
                  {currentCourse?.date
                    ? `Data kursu: ${currentCourse.date}`
                    : "Nowa edycja kursów CEEA już wkrótce!"}
                </p>

                <p className="text-gray-200 max-w-lg leading-relaxed text-lg drop-shadow-md">
                  {currentCourse?.description2 ||
                    "Dołącz do najnowszej edycji naszego kursu CEEA i rozwijaj swoje kompetencje w nowoczesny, praktyczny sposób. Wiedza, doświadczenie i inspiracja w jednym miejscu."}
                </p>

                {currentCourse && (
                  <motion.div whileHover={{ scale: 1.05 }} className="pt-2">
                    <Link
                      to={websiteRegister}
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-[#0077FF] to-[#00C6FF] text-white font-bold py-4 px-8 rounded-full shadow-[0_10px_40px_rgba(0,123,255,0.4)] hover:shadow-[0_15px_50px_rgba(0,123,255,0.6)] transition-all duration-300 text-lg dark:from-[#3fa7d6] dark:to-[#257ca3] dark:hover:from-[#257ca3] dark:hover:to-[#3fa7d6] dark:shadow-[#1e293b]/60"
                    >
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
                      Zapisz się na kurs
                    </Link>
                  </motion.div>
                )}
              </motion.div>

              {/* Prawa kolumna: obrazek */}
              <motion.div
                className="lg:col-span-7 relative max-lg:hidden flex items-center justify-center"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <div className="relative w-full max-w-2xl">
                  {/* Glow za zdjęciem */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#0077FF]/20 to-[#00C6FF]/20 rounded-[3rem] blur-2xl opacity-60" />

                  <motion.div className="relative group">
                    <GatsbyImage
                      image={getImage(
                        currentCourse?.image || data.defaultImage
                      )}
                      alt={currentCourse?.nameCourse || "CEEA kurs"}
                      className="rounded-[2.5rem] shadow-2xl shadow-black/40 border border-white/10 w-full"
                      imgClassName="object-cover"
                    />

                    {/* Gradient overlay - subtelniejszy */}
                    <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-black/20 via-transparent to-transparent" />

                    {/* Dekoracyjna ramka */}
                    <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-white/10" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
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
                  <GatsbyImage
                    image={getImage(course.image || data.defaultImage)}
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
                            {course?.type?.label ??
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
        )}

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
              Współpracujemy z
            </motion.h2>

            <div
              className={`grid gap-8 items-center justify-center opacity-80 place-items-center
                ${sponsors.length === 1 ? "grid-cols-1 max-w-xs mx-auto" : ""}
                ${sponsors.length === 2 ? "grid-cols-2 max-w-2xl mx-auto" : ""}
                ${sponsors.length === 3 ? "grid-cols-2 md:grid-cols-3 max-w-4xl mx-auto" : ""}
                ${sponsors.length >= 4 ? "grid-cols-2 md:grid-cols-4" : ""}
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

        {currentCourse?.available &&
          !!data?.datoCmsDetailedInformationAboutTheCourse && (
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
                  {currentCourse?.additionalInfo ||
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
                      data.activeCourse?.nodes[0]?.date
                    )}/${slugify(
                      data.activeCourse?.nodes[0]?.nameCourse
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
          gatsbyImageData(width: 800, placeholder: BLURRED)
        }
      }
    }
    activeCourse: allDatoCmsCourse(filter: { available: { eq: true } }) {
      nodes {
        id
        date
        nameCourse
        backgroundimage {
          gatsbyImageData(width: 800, placeholder: BLURRED)
        }
      }
    }

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
    // datoCmsMainsite {
    //   paragraph
    // }
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
