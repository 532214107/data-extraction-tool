const path = require('path')
const webpack = require('webpack')

const resolve = dir => {
  return path.join(__dirname, dir)
}


const port = 8080 // dev port

module.exports = {
  lintOnSave: false,
  publicPath: "./",
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: true,
  configureWebpack: {
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('_base', resolve('/'))
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
  },
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    port: port,
    host: '0.0.0.0',
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/api': {
        target: `https://ie.demo.actkg.com`,
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/api': 'https://ie.demo.actkg.com' },
        headers: {
          Referer: 'https://ie.demo.actkg.com'
        }
      },
    }
  }
}