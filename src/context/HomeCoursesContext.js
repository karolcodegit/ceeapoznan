import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { apiGet } from "../utils/api"

const HomeCoursesContext = createContext({
  status: "loading",
  courses: [],
  activeCourse: null,
  ready: false,
})

/**
 * Jedno źródło prawdy dla kursów „home” (header + homepage).
 * Do `ready` nie wolno pokazywać wariantu available — unika flasha przy refresh.
 */
export function HomeCoursesProvider({ children }) {
  const [status, setStatus] = useState("loading")
  const [courses, setCourses] = useState([])

  useEffect(() => {
    let cancelled = false
    apiGet("/courses?scope=home")
      .then(payload => {
        if (cancelled) return
        setCourses(Array.isArray(payload?.courses) ? payload.courses : [])
        setStatus("ready")
      })
      .catch(() => {
        if (cancelled) return
        setCourses([])
        setStatus("error")
      })
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(() => {
    const activeCourse =
      courses.find(c => c.available === true) || null
    return {
      status,
      courses,
      activeCourse,
      ready: status === "ready" || status === "error",
    }
  }, [status, courses])

  return (
    <HomeCoursesContext.Provider value={value}>
      {children}
    </HomeCoursesContext.Provider>
  )
}

export function useHomeCourses() {
  return useContext(HomeCoursesContext)
}

export default HomeCoursesContext
