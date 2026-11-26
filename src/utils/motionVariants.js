/** Shared framer-motion variants — subtle fade/slide + stagger. */

export const EASE_OUT = [0.22, 1, 0.36, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
}

export const fadeUpSoft = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.06 },
  },
}

export const pageEnterTransition = {
  duration: 0.42,
  ease: EASE_OUT,
}

/** Instant variants when prefers-reduced-motion is on. */
export function withReducedMotion(variants, reduceMotion) {
  if (!reduceMotion) return variants
  return {
    hidden: { opacity: 1, y: 0, x: 0 },
    visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0 } },
    exit: { opacity: 1, transition: { duration: 0 } },
  }
}
