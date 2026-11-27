require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
})
require("dotenv").config({
  path: `.env.development`,
  override: false,
})
const { slugify } = require("./src/utils/slugify")
const { writeCourseSitemapPaths } = require("./src/utils/courseSitemap")

function getYearFromDate(date) {
  if (!date) return "brak-roku"
  if (/^\d{4}-\d{2}-\d{2}/.test(date)) return date.slice(0, 4)
  const dateParts = String(date).split(".")
  if (dateParts.length > 1) return dateParts[2].slice(-4)
  return String(date).length === 4 ? date : "brak-roku"
}

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    stats: "errors-only",
  })
}

/**
 * Pobierz kursy z API przy starcie builda → URL-e do sitemap
 * (strony kursów nadal CSR przez [...], ale crawler dostaje realne loc).
 */
exports.onPreBootstrap = async () => {
  const endpoint = (process.env.GATSBY_REGISTER_ENDPOINT || "")
    .trim()
    .replace(/^['"]|['"]$/g, "")
  if (!endpoint) {
    console.warn("[ceea-seo] GATSBY_REGISTER_ENDPOINT missing — empty course sitemap")
    writeCourseSitemapPaths([])
    return
  }

  try {
    const res = await fetch(`${endpoint.replace(/\/$/, "")}/courses`)
    if (!res.ok) throw new Error(`courses HTTP ${res.status}`)
    const json = await res.json()
    const courses = Array.isArray(json?.courses) ? json.courses : []
    const paths = []
    const seen = new Set()

    for (const course of courses) {
      if (!course?.title) continue
      const year = getYearFromDate(course.start_date || course.date_label)
      const slug = slugify(course.title)
      if (!slug) continue
      const y = year === "brak-roku" ? "kurs" : year
      const base = `/kursy/${y}/${slug}/`
      if (seen.has(base)) continue
      seen.add(base)
      paths.push(base)
      paths.push(`/kursy/${y}/${slug}/szczegoly/`)
    }

    writeCourseSitemapPaths(paths)
    console.log(`[ceea-seo] sitemap course paths: ${paths.length}`)
  } catch (err) {
    console.warn(`[ceea-seo] course fetch for sitemap failed: ${err.message}`)
    writeCourseSitemapPaths([])
  }
}
