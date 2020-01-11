module.exports = {
  publicPath: '/admin/',
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api/': {
        target: 'http://sa.yzzx.org',
        ws: true,
        changeOrigin: true
      },
      '/www/': {
        target: 'http://sa.yzzx.org',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/www': ''
        }
      }
    }
  }
};
