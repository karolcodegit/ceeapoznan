const path = require('path')
const { slugify } = require('./utils/slugify')

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const result = await graphql(`
    query {
      allDatoCmsCourse {
        nodes {
          id
          nameCourse
        }
      }
    }
  `)

  result.data.allDatoCmsCourse.nodes.forEach((node) => {
    createPage({
      path: `/kursy/${slugify(node.nameCourse)}`,
      component: path.resolve(`./src/templates/course.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        id: node.id,
      },
    })
  })


  result.data.allDatoCmsCourse.nodes.forEach((node) => {
    createPage({
      path: `/kursy/${slugify(node.nameCourse)}/szczegoly`,
      component: path.resolve(`./src/templates/course-details.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        id: node.id,
      },
    })
  })

  // Tworzenie stron rejestracji dla każdego kursu
  result.data.allDatoCmsCourse.nodes.forEach(node => {
    createPage({
      path: `/kursy/${slugify(node.nameCourse)}/rejestracja`,
      component: path.resolve(`./src/templates/registration.js`),
      context: {
        // Przekazanie ID kursu do strony
        id: node.id,
      },
    });
  });
}


