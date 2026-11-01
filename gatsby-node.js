exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    stats: "errors-only",
  })
}