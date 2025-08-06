const path = require("path")
const { slugify } = require("./src/utils/slugify")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const result = await graphql(`
    query {
      allDatoCmsCourse {
        nodes {
          id
          nameCourse
          date
        }
      }
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

  result.data.allDatoCmsCourse.nodes.forEach(node => {
    if (node.date && node.date.length > 0) {
      // Wyciągnij rok z daty ręcznie
      let year
      const dateParts = node.date.split(".")
      if (dateParts.length > 1) {
        year = dateParts[2].slice(-4) // Dla formatu np. "8-10.05.2025"
      } else if (node.date.length === 4) {
        year = node.date // Dla formatu np. "2025" lub "2026"
      } else {
        console.warn(`Nieznany format daty dla kursu ${node.nameCourse}`)
        year = "brak-roku" // Możesz przypisać wartość domyślną, jeśli format daty jest niepoprawny
      }

      const courseSlug = slugify(node.nameCourse)

      // Tworzenie strony kursu
      createPage({
        path: `/kursy/${year}/${courseSlug}`,
        component: path.resolve(`./src/templates/course.js`),
        context: {
          id: node.id,
        },
      })

      // Tworzenie strony szczegółów kursu
      createPage({
        path: `/kursy/${year}/${courseSlug}/szczegoly`,
        component: path.resolve(`./src/templates/course-details.js`),
        context: {
          id: node.id,
        },
      })

      // Tworzenie strony rejestracji dla każdego kursu
      createPage({
        path: `/kursy/${year}/${courseSlug}/rejestracja`,
        component: path.resolve(`./src/templates/registration.js`),
        context: {
          id: node.id,
        },
      })
      createPage({
        path: `/kursy/${year}/${courseSlug}/rejestracja/formularz-wyslany`,
        component: path.resolve(`./src/templates/formularz-wyslany.js`), // Komponent dla strony sukcesu
        context: {}, // Możesz przekazać dodatkowe dane, jeśli potrzebujesz
      });
    } else {
      console.warn(`Brak daty dla kursu ${node.nameCourse}`)
    }
  })

  const books = result.data.allDatoCmsBook.nodes

  // Tworzenie stron dla każdej książki
  books.forEach(book => {
    const bookSlug = slugify(book.title) // Tworzymy slug na podstawie tytułu książki

    if (!book.id || !book.title) {
      console.warn(`Pominięto książkę z brakującymi danymi: ${JSON.stringify(book)}`)
      return
    }
  })
}

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  // W zależności od etapu (development/production)
  actions.setWebpackConfig({
    stats: "errors-only", // Pokazuje tylko błędy
  })
}
