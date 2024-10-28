import * as React from "react"
import Seo from "../components/seo"
import { Link } from "gatsby"
import { StaticImage } from 'gatsby-plugin-image';

const NotFoundPage = () => (
  <div class=" flex flex-col items-center justify-center py-20">
    <div class="text-center flex max-lg:flex-col justify-between items-center">
      <div>
        <h1 class="leading-big text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 mb-6  dark:text-gray-300">
          Strona nie istnieje
        </h1>

        <p class="text-lg text-gray-700 mb-8">
          Ups! Wygląda na to, że trafiłeś na stronę, której nie ma...
        </p>
      </div>
      <div>
      <StaticImage
          src="../assets/images/404.png" // Ścieżka do obrazka
          alt="Sad Face"
          className="mx-auto max-w-lg mb-8"
          placeholder="blurred" // Opcjonalnie, możesz ustawić placeholder
          layout="constrained" // lub "fixed", "fullWidth" w zależności od potrzeb
        />
      </div>
      
    </div>
    <Link
        to="/"
        class="mt-6 inline-block px-6 py-3 text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
      >
        Wróć na stronę główną
      </Link>
  </div>
)

export const Head = () => <Seo title="Nie znaleziono strony" />

export default NotFoundPage
