import React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { useLocation } from "@reach/router"
import { pageEnterTransition } from "../../utils/motionVariants"

/**
 * Subtle page-level fade/slide on route change.
 * Respects prefers-reduced-motion.
 */
const PageEnter = ({ children }) => {
  const { pathname } = useLocation()
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div key={pathname}>{children}</div>
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={pageEnterTransition}
    >
      {children}
    </motion.div>
  )
}

export default PageEnter
