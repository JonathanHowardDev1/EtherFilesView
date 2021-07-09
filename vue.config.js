module.exports = {
  publicPath: process.env.NODE_ENV === 'production' 
  ? '/EtherCloudTest1/'
  : '/',
  transpileDependencies: [
    'vuetify'
  ]
}
