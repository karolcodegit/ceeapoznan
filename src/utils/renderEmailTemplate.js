import React from "react"
import ReactDOMServer from "react-dom/server" // Import ReactDOMServer
import juice from "juice"
import he from "he"
import OrderConfirmation from "../utils/emails/books/orderConfirmation"
import orderConfirmationUser from "../utils/emails/books/orderConfirmationUser"
import ContactConfirmation from "../utils/emails/contact/contactConfirmation"
import ContactConfirmationUser from "../utils/emails/contact/contactConfirmationUser"
import CourseConfirmation from "../utils/emails/course/courseConfirmation"
import CourseConfirmationUser from "../utils/emails/course/courseConfirmationUser"


export const renderEmailTemplate = (templateName, data) => {
  const templates = {
    orderConfirmation: OrderConfirmation,
    orderConfirmationUser: orderConfirmationUser,
    ContactConfirmation: ContactConfirmation,
    ContactConfirmationUser: ContactConfirmationUser,
    CourseConfirmation: CourseConfirmation,
    CourseConfirmationUser: CourseConfirmationUser,

  }

  const TemplateComponent = templates[templateName]
  if (!TemplateComponent) {
    throw new Error(`Nie znaleziono szablonu: ${templateName}`)
  }

  //console.log("Dane przekazywane do szablonu:", data) // Debug: sprawdź dane wejściowe
  const rawHtml = ReactDOMServer.renderToStaticMarkup(
    <TemplateComponent {...data} />
  )

  // Inline'owanie stylów
  const inlinedHtml = juice(rawHtml)
  const decodedHtml = he.decode(inlinedHtml)

  return decodedHtml
}
