import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"

const cld = (url, w) =>
  url && url.includes("res.cloudinary.com")
    ? url.replace("/upload/", `/upload/w_${w},q_auto,f_auto/`)
    : url

/**
 * Hero parallax na stronie głównej.
 * Nie zmienia Header/Footer — tylko sekcja pod nawigacją.
 */
const HeroParallax = ({
  currentCourse,
  websiteRegister,
  defaultImage,
  coursesPath = "/kursy/",
  coursesReady = false,
}) => {
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const yBg = useTransform(scrollY, [0, 600], [0, reduceMotion ? 0 : 140])
  const yMid = useTransform(scrollY, [0, 600], [0, reduceMotion ? 0 : 70])
  const yFg = useTransform(scrollY, [0, 600], [0, reduceMotion ? 0 : -40])
  const opacityFade = useTransform(scrollY, [0, 420], [1, reduceMotion ? 1 : 0.35])

  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (reduceMotion || typeof window === "undefined") return undefined
    if (window.matchMedia("(max-width: 1023px)").matches) return undefined

    const onMove = e => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      setTilt({ x: ny * -6, y: nx * 8 })
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [reduceMotion])

  // Dopóki dane niepewne — nie pokazuj fallbacku „nieaktywny”, tylko skeleton
  const showCourseUi = coursesReady && !!currentCourse
  const title = showCourseUi
    ? currentCourse.title
    : coursesReady
      ? "Centrum Edukacji CEEA"
      : null
  const dateLabel = showCourseUi
    ? currentCourse.date_label
      ? `Data kursu: ${currentCourse.date_label}`
      : null
    : coursesReady
      ? "Nowa edycja kursów CEEA już wkrótce!"
      : null
  const description = showCourseUi
    ? currentCourse.home_description ||
      "Dołącz do najnowszej edycji naszego kursu CEEA i rozwijaj swoje kompetencje w nowoczesny, praktyczny sposób. Wiedza, doświadczenie i inspiracja w jednym miejscu."
    : coursesReady
      ? "Dołącz do najnowszej edycji naszego kursu CEEA i rozwijaj swoje kompetencje w nowoczesny, praktyczny sposób. Wiedza, doświadczenie i inspiracja w jednym miejscu."
      : null

  const courseImg =
    showCourseUi && currentCourse?.image_url
      ? cld(currentCourse.image_url, 1400)
      : null
  const fallback = getImage(defaultImage)

  return (
    <section className="relative w-full overflow-hidden min-h-[88vh] sm:min-h-[92vh] lg:min-h-[100vh] bg-[#070b14] text-white">
      {/* Warstwa tła — parallax */}
      <motion.div className="absolute inset-0" style={{ y: yBg }}>
        <div className="absolute inset-0 scale-110">
          {courseImg ? (
            <img
              src={courseImg}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover opacity-40"
            />
          ) : fallback ? (
            <GatsbyImage
              image={fallback}
              alt=""
              aria-hidden="true"
              className="h-full w-full"
              imgClassName="object-cover opacity-40"
            />
          ) : (
            <div className="h-full w-full bg-slate-900" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#070b14]/95 via-[#0b1f3a]/88 to-[#0c6478]/55" />
        <div
          className="absolute -left-24 top-10 h-[28rem] w-[28rem] rounded-full blur-[100px] opacity-50 hero2-blob"
          style={{
            background: "radial-gradient(circle, #0077FF 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -right-16 bottom-0 h-[24rem] w-[24rem] rounded-full blur-[90px] opacity-40 hero2-blob"
          style={{
            background: "radial-gradient(circle, #00C896 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute right-1/4 top-1/3 h-[18rem] w-[18rem] rounded-full blur-[80px] opacity-30 hero2-blob"
          style={{
            background: "radial-gradient(circle, #E8A317 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto flex min-h-[88vh] sm:min-h-[92vh] lg:min-h-[100vh] max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24"
        style={{ opacity: opacityFade }}
      >
        <motion.div
          className="mb-7 flex gap-3.5 sm:mb-9 sm:gap-4"
          style={{
            y: yMid,
            fontFamily: '"Syne", "Montserrat", system-ui, sans-serif',
          }}
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          aria-label="CEEA – Ośrodek Poznański"
        >
          <span
            className="mt-1 w-0.5 shrink-0 self-stretch rounded-full bg-gradient-to-b from-[#E8A317] via-[#7EC8EB]/55 to-transparent"
            aria-hidden="true"
          />
          <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
            <span
              className="text-[2.65rem] font-semibold leading-none tracking-[0.14em] sm:text-5xl lg:text-6xl xl:text-[4.1rem]"
              aria-hidden="true"
            >
              <span className="text-[#7DD3FC]">C</span>
              <span className="text-[#38BDF8]">E</span>
              <span className="text-[#2DD4BF]">E</span>
              <span className="text-[#FACC86]">A</span>
            </span>
            <span className="sr-only">CEEA</span>
            <span
              className="hidden h-8 w-px shrink-0 bg-white/25 sm:block lg:h-10"
              aria-hidden="true"
            />
            <span className="text-[0.68rem] font-medium uppercase leading-relaxed tracking-[0.3em] text-[#B8D9EC]/90 sm:text-xs lg:text-[0.8rem] lg:tracking-[0.34em]">
              Ośrodek Poznański
            </span>
          </div>
        </motion.div>

        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <motion.div
            className="lg:col-span-6"
            style={{ y: yMid }}
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {!coursesReady ? (
              <div className="space-y-4" aria-busy="true" aria-live="polite">
                <div className="h-6 w-36 animate-pulse rounded-full bg-white/20" />
                <div className="h-10 w-[92%] max-w-xl animate-pulse rounded-lg bg-white/15 sm:h-12" />
                <div className="h-5 w-48 animate-pulse rounded bg-white/15" />
                <div className="h-16 w-full max-w-xl animate-pulse rounded-lg bg-white/10" />
                <div className="mt-8 flex flex-wrap gap-3">
                  <div className="h-12 w-44 animate-pulse rounded-full bg-white/20" />
                  <div className="h-12 w-40 animate-pulse rounded-full bg-white/10" />
                </div>
              </div>
            ) : (
              <>
                {currentCourse?.available && (
                  <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[#5ec4a8]/35 bg-[#0c6478]/55 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#B8EBD9] shadow-sm shadow-black/20 backdrop-blur-sm">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-[#5ec4a8]"
                      aria-hidden="true"
                    />
                    Kurs już dostępny
                  </span>
                )}

                <h1 className="text-3xl sm:text-4xl lg:text-[2.85rem] xl:text-5xl font-extrabold leading-[1.12] drop-shadow-lg">
                  {title}
                </h1>
                {dateLabel && (
                  <p className="mt-4 text-base sm:text-lg font-semibold text-sky-100/95">
                    {dateLabel}
                  </p>
                )}
                {description && (
                  <p className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-white/85">
                    {description}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                  {currentCourse?.available && (
                    <Link
                      to={websiteRegister}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0077FF] to-[#00C6FF] px-7 py-3.5 text-base font-bold text-white shadow-[0_12px_40px_rgba(0,119,255,0.45)] transition hover:shadow-[0_16px_48px_rgba(0,119,255,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00C6FF]"
                    >
                      Zapisz się na kurs
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14m-7-7 7 7-7 7"
                        />
                      </svg>
                    </Link>
                  )}
                  <Link
                    to={coursesPath}
                    className="inline-flex items-center rounded-full border border-white/35 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
                  >
                    Przeglądaj ofertę
                  </Link>
                </div>
              </>
            )}
          </motion.div>

          <motion.div
            className="lg:col-span-6"
            style={{ y: yFg }}
            initial={reduceMotion ? false : { opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          >
            <div
              className="relative mx-auto w-full max-w-xl perspective-[1200px]"
              style={{ perspective: "1200px" }}
            >
              <div
                className="absolute -inset-6 rounded-[2.75rem] bg-gradient-to-br from-[#0077FF]/25 via-[#00C896]/15 to-[#E8A317]/20 blur-2xl "
                aria-hidden="true"
              />
              <div
                className="relative overflow-hidden rounded-[1.75rem] sm:rounded-[2.25rem] border border-white/15 shadow-2xl shadow-black/50 transition-transform duration-300 ease-out will-change-transform max-lg:hidden"
                style={{
                  transform: reduceMotion
                    ? undefined
                    : `rotateY(${tilt.y}deg) rotateX(${tilt.x}deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                {courseImg ? (
                  <img
                    src={courseImg}
                    alt={title}
                    className="aspect-[4/3] w-full object-cover max-lg:hidden"
                    loading="eager"
                  />
                ) : fallback ? (
                  <GatsbyImage
                    image={fallback}
                    alt={title}
                    className="aspect-[4/3] w-full max-lg:hidden"
                    imgClassName="object-cover"
                  />
                ) : null}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/35 via-transparent to-white/10"
                  aria-hidden="true"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-3 sm:p-4 backdrop-blur-md">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#E8A317]">
                      Regionalne Centrum CEEA
                    </p>
                    <p className="mt-1 text-sm sm:text-base font-semibold text-white line-clamp-2">
                      Kształcenie ustawiczne w anestezjologii i intensywnej
                      terapii
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Delikatne przejście do kolejnej sekcji */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-100 to-transparent dark:from-slate-900"
        aria-hidden="true"
      />

      <style>{`
        @media (max-width: 1023px) {
          .hero2-blob { filter: blur(60px) !important; opacity: .22 !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero2-blob { animation: none !important; }
        }
      `}</style>
    </section>
  )
}

export default HeroParallax
