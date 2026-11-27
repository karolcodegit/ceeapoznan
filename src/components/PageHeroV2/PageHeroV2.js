import React from "react"
import { Link } from "gatsby"
import { motion, useReducedMotion } from "framer-motion"
import {
  fadeUp,
  staggerContainer,
  withReducedMotion,
} from "../../utils/motionVariants"
import SeasonalBandEffects from "../SeasonalTheme/SeasonalBandEffects"

/**
 * Full-bleed gradient intro used by marketing / checkout pages.
 * @param {{ title: string, subtitle?: string, description?: string, crumbs?: { label: string, to?: string }[], actions?: React.ReactNode }} props
 */
const PageHeroV2 = ({
  title,
  subtitle,
  description,
  crumbs = [],
  actions,
}) => {
  const reduceMotion = useReducedMotion()
  const item = withReducedMotion(fadeUp, reduceMotion)
  const container = withReducedMotion(staggerContainer, reduceMotion)

  return (
    <section className="seasonal-subpage-band relative w-full overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#0b1f3a] via-[#0c6478] to-[#023e8a]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-[#E8A317]/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[#00C896]/15 blur-3xl"
        aria-hidden="true"
      />
      <SeasonalBandEffects />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="max-w-3xl text-white"
        >
          {crumbs.length > 0 && (
            <motion.nav
              variants={item}
              aria-label="Okruszki nawigacyjne"
              className="mb-6"
            >
              <ol className="flex flex-wrap items-center gap-2 text-sm text-white/75">
                {crumbs.map((crumb, i) => {
                  const isLast = i === crumbs.length - 1
                  return (
                    <React.Fragment key={`${crumb.label}-${i}`}>
                      {i > 0 && (
                        <li aria-hidden="true" className="text-white/40">
                          /
                        </li>
                      )}
                      <li
                        className={
                          isLast
                            ? "font-semibold text-white"
                            : undefined
                        }
                        aria-current={isLast ? "page" : undefined}
                      >
                        {crumb.to && !isLast ? (
                          <Link
                            to={crumb.to}
                            className="rounded-sm transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
                          >
                            {crumb.label}
                          </Link>
                        ) : (
                          crumb.label
                        )}
                      </li>
                    </React.Fragment>
                  )
                })}
              </ol>
            </motion.nav>
          )}
          <motion.h1
            variants={item}
            className="break-words text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            {title}
          </motion.h1>
          {subtitle ? (
            <motion.p
              variants={item}
              className="mt-3 text-lg sm:text-xl font-semibold text-[#E8A317]"
            >
              {subtitle}
            </motion.p>
          ) : null}
          {description ? (
            <motion.p
              variants={item}
              className="mt-5 text-base sm:text-lg leading-relaxed text-white/90"
            >
              {description}
            </motion.p>
          ) : null}
          {actions ? (
            <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
              {actions}
            </motion.div>
          ) : null}
        </motion.div>
      </div>
    </section>
  )
}

export default PageHeroV2
