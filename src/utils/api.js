// src/utils/api.js — jeden cache na zapytania do Cloud Run (deduplikacja!)
const API_URL =
  process.env.GATSBY_CLOUD_API_URL ||
  process.env.GATSBY_REGISTER_ENDPOINT ||
  "https://ceea-registration-course-559160331745.europe-central2.run.app"

const cache = {}

export function apiGet(path) {
  if (!cache[path]) {
    cache[path] = fetch(`${API_URL}${path}`)
      .then(r => { if (!r.ok) throw new Error(path); return r.json() })
      .catch(e => { delete cache[path]; throw e })
  }
  return cache[path]
}
