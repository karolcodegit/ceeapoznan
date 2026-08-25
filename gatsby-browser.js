import React from "react"
import { Provider } from "react-redux"
// import * as Sentry from "@sentry/react";
// import { BrowserTracing } from "@sentry/react";
import { store } from "./src/store/index"
import "./src/styles/global.css"
import "react-toastify/dist/ReactToastify.css"

export const onClientEntry = () => {
  if (typeof window !== "undefined") {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://geowidget.inpost.pl/inpost-geowidget.css"
    document.head.appendChild(link)

    const script = document.createElement("script")
    script.src = "https://geowidget.inpost.pl/inpost-geowidget.js"
    script.defer = true
    document.body.appendChild(script)
  }
}

const track = path => {
  try {
    const host = window.location.hostname
    if (host !== "ceea.org.pl" && host !== "www.ceea.org.pl") return
    const data = JSON.stringify({ path, referrer: document.referrer || null })
    navigator.sendBeacon(
      "https://panel.ceea.org.pl/api/track",
      new Blob([data], { type: "text/plain" })
    )
  } catch {}
}

export const onInitialClientRender = () => {
  track(window.location.pathname + window.location.search)
}

export const onRouteUpdate = ({ location }) => {
  track(location.pathname + location.search)
}

export const wrapRootElement = ({ element }) => (
  <Provider store={store}>{element}</Provider>
)

//   export const onRouteUpdate = ({ location }) => {
//     const params = new URLSearchParams(location.search);
//     const preview = params.get("preview");

//     if (!preview && !location.pathname.startsWith("/maintenance")) {
//         window.location.replace("/maintenance");
//     }
// };