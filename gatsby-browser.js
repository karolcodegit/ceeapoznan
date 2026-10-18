import React from "react"
import { Provider } from "react-redux"
import { store } from "./src/store/index"
import "./src/styles/global.css"
import "react-toastify/dist/ReactToastify.css"

export const onClientEntry = () => {
  if (typeof window !== "undefined") {
    // InPost widget
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://geowidget.inpost.pl/inpost-geowidget.css"
    document.head.appendChild(link)

    const inpostScript = document.createElement("script")
    inpostScript.src = "https://geowidget.inpost.pl/inpost-geowidget.js"
    inpostScript.defer = true
    document.body.appendChild(inpostScript)

    // // CEEA Feedback Widget
    // window.CEEA_FEEDBACK_CONFIG = {
    //   supabaseUrl: 'https://kdksdqfnfqoauphpippu.supabase.co',
    //   edgeFunctionUrl: 'https://kdksdqfnfqoauphpippu.supabase.co/functions/v1/feedback-submit',
    //   anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtka3NkcWZuZnFvYXVwaHBpcHB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2ODcxMTcsImV4cCI6MjEwNDI2MzExN30.4gBxpq2yqvVf6O4spB8V7c1xiHEhxSz5oy2j0hHXsdg',
    //   source: 'website',
    //   position: 'bottom-right',
    //   primaryColor: '#0ea5e9',
    // };

    //const feedbackScript = document.createElement("script")
    //feedbackScript.src = '/ceea-feedback-widget.js'
    //feedbackScript.defer = true
    //document.body.appendChild(feedbackScript)
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