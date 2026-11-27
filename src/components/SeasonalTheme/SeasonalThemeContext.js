import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import {
  PREVIEW_STORAGE_KEY,
  SEASONAL_THEMES,
  isSeasonalAutoEnabled,
  isSeasonalPreviewEnabled,
  resolveSeasonalThemeId,
} from "../../themes/seasonalThemes"

const SeasonalThemeContext = createContext({
  themeId: null,
  theme: null,
  previewEnabled: false,
  autoEnabled: false,
  calendarThemeId: null,
  setPreviewTheme: () => {},
  clearPreview: () => {},
})

function normalizeThemeId(id) {
  if (!id || id === "off") return null
  if (id === "frost") return "classic" // stara nazwa → klasyczny
  if (SEASONAL_THEMES[id]) return id
  return null
}

function readStoredPreview() {
  if (typeof window === "undefined") return undefined
  try {
    const params = new URLSearchParams(window.location.search)
    const fromQuery = params.get("theme")
    if (fromQuery) return normalizeThemeId(fromQuery)
    const stored = window.localStorage.getItem(PREVIEW_STORAGE_KEY)
    if (stored != null) return normalizeThemeId(stored)
  } catch {
    /* ignore */
  }
  return undefined // undefined = brak ręcznego wyboru
}

export const SeasonalThemeProvider = ({ children }) => {
  const previewEnabled = isSeasonalPreviewEnabled()
  const autoEnabled = isSeasonalAutoEnabled()
  const calendarThemeId = useMemo(() => resolveSeasonalThemeId(new Date()), [])

  const [manualPreview, setManualPreview] = useState(undefined)

  useEffect(() => {
    setManualPreview(readStoredPreview())
  }, [])

  const themeId = useMemo(() => {
    if (previewEnabled && manualPreview !== undefined) {
      return manualPreview // null = wymuszone wyłączenie
    }
    if (autoEnabled) return calendarThemeId
    return null
  }, [previewEnabled, manualPreview, autoEnabled, calendarThemeId])

  useEffect(() => {
    if (typeof document === "undefined") return
    const root = document.documentElement
    if (themeId) {
      root.setAttribute("data-seasonal", themeId)
    } else {
      root.removeAttribute("data-seasonal")
    }
  }, [themeId])

  const setPreviewTheme = useCallback(
    id => {
      if (!previewEnabled) return
      const next = id && SEASONAL_THEMES[id] ? id : null
      setManualPreview(next)
      try {
        window.localStorage.setItem(PREVIEW_STORAGE_KEY, next || "off")
      } catch {
        /* ignore */
      }
    },
    [previewEnabled]
  )

  const clearPreview = useCallback(() => {
    setManualPreview(undefined)
    try {
      window.localStorage.removeItem(PREVIEW_STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo(
    () => ({
      themeId,
      theme: themeId ? SEASONAL_THEMES[themeId] : null,
      previewEnabled,
      autoEnabled,
      calendarThemeId,
      setPreviewTheme,
      clearPreview,
    }),
    [
      themeId,
      previewEnabled,
      autoEnabled,
      calendarThemeId,
      setPreviewTheme,
      clearPreview,
    ]
  )

  return (
    <SeasonalThemeContext.Provider value={value}>
      {children}
    </SeasonalThemeContext.Provider>
  )
}

export const useSeasonalTheme = () => useContext(SeasonalThemeContext)
