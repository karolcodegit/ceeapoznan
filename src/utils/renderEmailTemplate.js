import React from "react"
import ReactDOMServer from "react-dom/server" // Import ReactDOMServer
import juice from "juice"
import he from "he"
import OrderConfirmation from "../templates/emails/books/orderConfirmation"
import orderConfirmationUser from "../templates/emails/books/orderConfirmationUser"
import ContactConfirmation from "../templates/emails/contact/contactConfirmation"
import ContactConfirmationUser from "../templates/emails/contact/contactConfirmationUser"
import CourseConfirmation from "../templates/emails/course/courseConfirmation"
import CourseConfirmationUser from "../templates/emails/course/courseConfirmationUser"


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
