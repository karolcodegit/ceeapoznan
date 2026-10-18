// src/components/SponsorsSection.jsx
// Sekcja „Współpracujemy z" – dane ze Supabase przez Cloud Run (nie GraphQL).
// ≤3 sponsorów: siatka. >3: karuzela (autoplay + strzałki + kropki + swipe).
import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"

const API_URL =
  process.env.GATSBY_REGISTER_ENDPOINT;

const AUTOPLAY_MS = 4000

function usePerView() {
  const calc = () =>
    typeof window === "undefined" ? 3 : window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3
  const [perView, setPerView] = useState(calc)
  useEffect(() => {
    const onResize = () => setPerView(calc())
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])
  return perView
}

const SponsorsSection = () => {
  const [sponsors, setSponsors] = useState([])
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const perView = usePerView()
  const touchX = useRef(null)

  useEffect(() => {
    let cancelled = false
    fetch(`${API_URL}/sponsors`)
      .then(r => {
        if (!r.ok) throw new Error("sponsors")
        return r.json()
      })
      .then(({ sponsors }) => {
        if (!cancelled) setSponsors(sponsors || [])
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const maxIndex = Math.max(0, sponsors.length - perView)

  // clamp indeksu, gdy zmienia się szerokość / liczba sponsorów
  useEffect(() => {
    setIndex(i => Math.min(i, maxIndex))
  }, [maxIndex])

  const next = useCallback(() => setIndex(i => (i >= maxIndex ? 0 : i + 1)), [maxIndex])
  const prev = () => setIndex(i => (i <= 0 ? maxIndex : i - 1))

  // autoplay
  useEffect(() => {
    if (sponsors.length <= perView || paused) return
    const t = setInterval(next, AUTOPLAY_MS)
    return () => clearInterval(t)
  }, [sponsors.length, perView, paused, next])

  // swipe (mobile)
  const onTouchStart = e => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = e => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)()
    touchX.current = null
  }

  if (sponsors.length === 0) return null

  const slidePct = 100 / perView
  const isCarousel = sponsors.length > 3

  const Logo = ({ s, idx }) => {
    const img = s.logo_url ? (
      <img
        src={s.logo_url}
        alt={s.name || `Sponsor ${idx + 1}`}
        loading="lazy"
        className="h-auto max-h-36 w-auto max-w-full object-contain mx-auto transition-all duration-300 dark:invert dark:brightness-125 dark:contrast-125"
      />
    ) : (
      <span className="text-lg font-semibold text-[#002C7C] dark:text-sky-300">{s.name}</span>
    )
    return s.website_url ? (
      <a href={s.website_url} target="_blank" rel="noopener noreferrer" aria-label={`Odwiedź stronę sponsora ${s.name || ""}`}>
        {img}
      </a>
    ) : (
      img
    )
  }

  return (
    <section className="py-24 bg-gray-50 dark:bg-slate-800 overflow-hidden">
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

        {!isCarousel ? (
          /* ── Siatka: 1–3 sponsorów ── */
          <div
            className={`grid gap-8 items-center justify-center opacity-80 place-items-center
              ${sponsors.length === 1 ? "grid-cols-1 max-w-xs mx-auto" : ""}
              ${sponsors.length === 2 ? "grid-cols-2 max-w-2xl mx-auto" : ""}
              ${sponsors.length === 3 ? "grid-cols-2 md:grid-cols-3 max-w-4xl mx-auto" : ""}
            `}
          >
            {sponsors.map((s, idx) => (
              <motion.div
                key={s.name + idx}
                className="p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ scale: 1.1 }}
              >
                <Logo s={s} idx={idx} />
              </motion.div>
            ))}
          </div>
        ) : (
          /* ── Karuzela: 4+ sponsorów ── */
          <div
            className="relative opacity-80 select-none"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Strzałki */}
            <button
              onClick={prev}
              aria-label="Poprzedni sponsor"
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-white dark:bg-slate-700 shadow-md text-[#002C7C] dark:text-sky-300 hover:scale-110 transition"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Następny sponsor"
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-white dark:bg-slate-700 shadow-md text-[#002C7C] dark:text-sky-300 hover:scale-110 transition"
            >
              ›
            </button>

            {/* Slajdy */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${index * slidePct}%)` }}
              >
                {sponsors.map((s, idx) => (
                  <div
                    key={s.name + idx}
                    className="shrink-0 px-6 py-6"
                    style={{ width: `${slidePct}%` }}
                  >
                    <div className="while-hover-scale transition-transform duration-300 hover:scale-110">
                      <Logo s={s} idx={idx} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kropki (mobile + desktop) */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Slajd ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-7 bg-[#002C7C] dark:bg-sky-300"
                      : "w-2.5 bg-gray-300 dark:bg-slate-600 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default SponsorsSection
