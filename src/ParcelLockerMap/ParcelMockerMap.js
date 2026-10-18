import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Title from "../components/Title/Title"
import { setParcelLocker } from "../store/checkout/checkoutSlice"

const ParcelLockerMap = () => {
  const dispatch = useDispatch()
  const containerRef = useRef(null)
  const locker = useSelector(s => s.checkout.locker)

  // Jeśli paczkomat już wybrany (powrót na stronę / localStorage) – startuj ze zwiniętą mapą
  const [collapsed, setCollapsed] = useState(false)
  useEffect(() => {
    if (locker) setCollapsed(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const geowidget = document.createElement("inpost-geowidget")
    geowidget.setAttribute("token", process.env.GATSBY_INPOST_API)
    geowidget.setAttribute("language", "pl")
    geowidget.setAttribute("config", "parcelCollect")
    containerRef.current.innerHTML = ""
    containerRef.current.appendChild(geowidget)

    geowidget.addEventListener("inpost.geowidget.init", (event) => {
      event.detail.api.addPointSelectedCallback((point) => {
        dispatch(setParcelLocker({
          name: point.name,
          code: point.name,
          address: point.address_details,
        }))
        setCollapsed(true)
      })
    })
  }, [dispatch])

  return (
    <div className="w-full">
      <Title tag="h4" padding className="text-center">Mapa Paczkomatów</Title>

      <div
        ref={containerRef}
        className={`responsive-geowidget w-full h-[600px] max-h-[600px] overflow-hidden rounded-xl border border-gray-200 dark:border-slate-600 ${collapsed ? "hidden" : ""}`}
      />

      {locker && (
        <div className="mt-4 border border-gray-200 dark:border-slate-600 rounded-xl p-4 bg-gray-50 dark:bg-slate-700/40 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Wybrany paczkomat:</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
              <strong>{locker.name}</strong>
              <span className="text-gray-400 dark:text-gray-500"> · </span>
              {locker.address?.street} {locker.address?.building_number},{" "}
              {locker.address?.post_code} {locker.address?.city}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Zmień paczkomat
          </button>
        </div>
      )}
    </div>
  )
}

export default ParcelLockerMap