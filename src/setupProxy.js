const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = app => {
  app.use(
    createProxyMiddleware(
      '/apis',
      {
        target: 'http://www.shuiyue.info:12300',
        pathRewrite: {'/apis' : ''},
        changeOrigin: true
      }
    )
  )
}