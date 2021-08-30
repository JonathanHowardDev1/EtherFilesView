module.exports = {
  publicPath: process.env.NODE_ENV === 'production' 
  ? '/EtherCloudTest1/'
  : '/',
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: 'http://104.238.136.17/',
    https: 'true',
  }
}
