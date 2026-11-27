import React, { useMemo } from "react"
import { useSeasonalTheme } from "./SeasonalThemeContext"

/**
 * Efekty wewnątrz niebieskiego pasa (TopHeader / PageHeroV2):
 * - christmas → padający śnieg
 * - nye → fajerwerki
 * - classic / brak → nic
 */
const SeasonalBandEffects = () => {
  const { themeId, theme } = useSeasonalTheme()
  const effect = theme?.effect

  const snowflakes = useMemo(() => {
    if (effect !== "snow") return []
    return Array.from({ length: 28 }, (_, i) => ({
      i,
      left: (i * 3.7 + (i % 5) * 1.1) % 100,
      size: 2 + (i % 5),
      duration: 7 + (i % 9) * 0.85,
      delay: (i % 12) * 0.45,
      drift: (i % 2 === 0 ? 1 : -1) * (8 + (i % 6)),
    }))
  }, [effect])

  const bursts = useMemo(() => {
    if (effect !== "fireworks") return []
    return Array.from({ length: 7 }, (_, i) => ({
      i,
      left: 12 + ((i * 13) % 76),
      top: 18 + ((i * 17) % 55),
      delay: i * 0.85,
      hue: [42, 200, 320, 160, 25, 280, 50][i % 7],
    }))
  }, [effect])

  if (!themeId || !effect) return null

  if (effect === "snow") {
    return (
      <div className="seasonal-band-fx seasonal-band-fx--snow" aria-hidden="true">
        {snowflakes.map(f => (
          <span
            key={f.i}
            className="seasonal-snowflake"
            style={{
              left: `${f.left}%`,
              width: f.size,
              height: f.size,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              "--snow-drift": `${f.drift}px`,
            }}
          />
        ))}
      </div>
    )
  }

  if (effect === "fireworks") {
    return (
      <div
        className="seasonal-band-fx seasonal-band-fx--fireworks"
        aria-hidden="true"
      >
        {bursts.map(b => (
          <span
            key={b.i}
            className="seasonal-firework"
            style={{
              left: `${b.left}%`,
              top: `${b.top}%`,
              animationDelay: `${b.delay}s`,
              "--fw-hue": b.hue,
            }}
          />
        ))}
      </div>
    )
  }

  return null
}

export default SeasonalBandEffects
