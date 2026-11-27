const fs = require("fs")
const path = require("path")

const CACHE_FILE = path.join(
  process.cwd(),
  ".cache",
  "ceea-course-sitemap-paths.json"
)

/** Ścieżki kursów zapisane przez gatsby-node (onPreBootstrap). */
function getCourseSitemapPaths() {
  try {
    if (!fs.existsSync(CACHE_FILE)) return []
    const raw = fs.readFileSync(CACHE_FILE, "utf8")
    const data = JSON.parse(raw)
    return Array.isArray(data.paths) ? data.paths : []
  } catch {
    return []
  }
}

function writeCourseSitemapPaths(paths) {
  const dir = path.dirname(CACHE_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(
    CACHE_FILE,
    JSON.stringify({ paths: paths || [], generatedAt: new Date().toISOString() }),
    "utf8"
  )
}

module.exports = {
  getCourseSitemapPaths,
  writeCourseSitemapPaths,
  CACHE_FILE,
}
