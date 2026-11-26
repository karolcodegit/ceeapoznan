// src/utils/api.js — jeden cache na zapytania do Cloud Run (deduplikacja!)
const API_URL = (process.env.GATSBY_REGISTER_ENDPOINT || "")
  .trim()
  .replace(/^['"]|['"]$/g, "")

const cache = {}

export function apiGet(path) {
  if (!API_URL) {
    return Promise.reject(new Error("missing GATSBY_REGISTER_ENDPOINT"))
  }
  if (!cache[path]) {
    cache[path] = fetch(`${API_URL}${path}`)
      .then(r => {
        if (!r.ok) throw new Error(path)
        return r.json()
      })
      .catch(e => {
        delete cache[path]
        throw e
      })
  }
  return cache[path]
}
