import * as React from "react"

import Seo from "../components/seo"
import { Link } from "gatsby"

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404: Nie znaleziono</h1>
      <p className="text-gray-600">Ups! Wygląda na to, że trafiłeś na stronę, której nie ma... Smuteczek.</p>
      <img src="/path/to/sad-face.png" alt="Sad Face" className="mt-8 mx-auto max-w-xs" />
      <p className="mt-4 text-gray-500">Ale nie martw się, możesz wrócić na <Link href="/" className="text-blue-500 hover:underline">stronę główną</Link>.</p>
    </div>
  </div>
)

export const Head = () => <Seo title="Nie znaleziono strony" />

export default NotFoundPage
