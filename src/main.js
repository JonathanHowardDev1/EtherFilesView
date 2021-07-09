import Vue from 'vue';  // in this order 
import axios from 'axios'; // in this order
import VueAxios from 'vue-axios'; // in this order

//import App from './App.vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
//import VueCryptojs from 'vue-cryptojs';

Vue.use(VueAxios, axios);
//Vue.use(VueCryptojs);
Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
