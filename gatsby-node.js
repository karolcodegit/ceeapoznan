const path = require("path")
const { slugify } = require("./src/utils/slugify")

// UWAGA: strony kursów (szczegół / szczegoly / rejestracja / formularz-wyslany)
// NIE są już tworzone tutaj – obsługuje je client-only route
// src/pages/kursy/[...].js z danymi z Supabase. DatoCMS nieużywane w buildzie.

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const result = await graphql(`
    query {
      allDatoCmsBook {
        nodes {
          id
          title
          editor
          year
          price
          publisher
          covertype
          available
        }
      }
    }
  `)

  const books = result.data.allDatoCmsBook.nodes
  books.forEach(book => {
    const bookSlug = slugify(book.title)
    if (!book.id || !book.title) {
      console.warn(`Pominięto książkę z brakującymi danymi: ${JSON.stringify(book)}`)
      return
    }
  })
}

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  actions.setWebpackConfig({
    stats: "errors-only",
  })
}
