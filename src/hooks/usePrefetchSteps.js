import React, { useEffect } from "react"
import { Link } from "gatsby"

export const usePrefetchSteps = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && window.___loader) {
      window.___loader.prefetch("/koszyk")
      window.___loader.prefetch("/koszyk/dane")
      window.___loader.prefetch("/koszyk/dostawa")
      window.___loader.prefetch("/koszyk/podsumowanie")
    }
  }, [])

  return (
    <>
      <Link to="/koszyk" style={{ display: "none" }} />
      <Link to="/koszyk/dostawa" style={{ display: "none" }} />
      <Link to="/koszyk/podsumowanie" style={{ display: "none" }} />
    </>
  )
}