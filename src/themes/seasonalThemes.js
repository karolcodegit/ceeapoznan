/**
 * Motywy sezonowe CEEA — efekty w niebieskim pasie podstron + ozdoba logo.
 * Strefa czasowa okien: Europe/Warsaw.
 *
 * Auto-aktywacja: włączona domyślnie (wyłącz: GATSBY_SEASONAL_AUTO=0).
 * Podgląd ręczny: ?theme=christmas|nye|classic|off
 */

export const SEASONAL_THEMES = {
  christmas: {
    id: "christmas",
    label: "Świąteczna",
    short: "Boże Narodzenie",
    description:
      "Śnieg w niebieskim pasie tytułu + czerwona czapka na logo.",
    windowLabel: "1–26 grudnia",
    windows: [{ start: 1201, end: 1226 }],
    effect: "snow",
    logoAccent: "santa-hat",
    accents: {
      primary: "#C41E3A",
      secondary: "#0F6B4C",
      gold: "#D4A017",
    },
  },
  nye: {
    id: "nye",
    label: "Sylwestrowa",
    short: "Sylwester",
    description:
      "Fajerwerki w niebieskim pasie tytułu + kieliszek szampana przy logo.",
    windowLabel: "27 grudnia – 1 stycznia",
    windows: [
      { start: 1227, end: 1231 },
      { start: 101, end: 101 },
    ],
    effect: "fireworks",
    logoAccent: "champagne",
    accents: {
      primary: "#0B1F3A",
      secondary: "#E8C872",
      gold: "#F5E6A3",
    },
  },
  classic: {
    id: "classic",
    label: "Zimowa cisza",
    short: "Klasyczny",
    description:
      "Czysty niebieski pas i logo bez ozdób — cały pozostały rok poza sezonem świątecznym.",
    windowLabel: "pozostały rok",
    // Brak okien — resolveSeasonalThemeId zwraca null poza christmas/nye.
    windows: [],
    effect: null,
    logoAccent: null,
    accents: {
      primary: "#0C6478",
      secondary: "#0B1F3A",
      gold: "#E8A317",
    },
  },
}

export const THEME_ORDER = ["christmas", "nye", "classic"]

/** Części daty w Europe/Warsaw (rok, miesiąc, dzień). */
export function getWarsawDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)
  const get = type => Number(parts.find(p => p.type === type)?.value)
  return { year: get("year"), month: get("month"), day: get("day") }
}

export function toMonthDayKey(month, day) {
  return month * 100 + day
}

/**
 * Zwraca id motywu aktywnego wg daty, albo null (= klasyczny / bez dekoracji).
 */
export function resolveSeasonalThemeId(date = new Date()) {
  const { month, day } = getWarsawDateParts(date)
  const key = toMonthDayKey(month, day)
  for (const id of ["christmas", "nye"]) {
    const theme = SEASONAL_THEMES[id]
    for (const w of theme.windows) {
      if (key >= w.start && key <= w.end) return id
    }
  }
  return null
}

/** Auto włączone domyślnie; wyłączanie: GATSBY_SEASONAL_AUTO=0 */
export function isSeasonalAutoEnabled() {
  return process.env.GATSBY_SEASONAL_AUTO !== "0"
}

export function isSeasonalPreviewEnabled() {
  if (process.env.GATSBY_SEASONAL_PREVIEW === "1") return true
  if (process.env.GATSBY_SEASONAL_PREVIEW === "0") return false
  return process.env.NODE_ENV === "development"
}

export const PREVIEW_STORAGE_KEY = "ceea-seasonal-preview"
