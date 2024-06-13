const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/graphql',  // Ścieżka, którą chcesz przekierować (dostosuj do swojego API)
    createProxyMiddleware({
      target: 'https://graphql.datocms.com/',  // Adres docelowy (Twoje API)
      changeOrigin: true,
      pathRewrite: {
        '^/graphql': '',  // Jeśli ścieżka na serwerze jest inna, dostosuj tutaj
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer 3f592b80e80a7f8b1c98291f7af047`,  // Zastąp tokenem API DatoCMS
      },
    })
  );
};