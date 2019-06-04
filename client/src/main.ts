import Vue from "vue";
import './plugins/vuetify'
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import axios from 'axios';

Vue.prototype.$http = axios;
Vue.config.productionTip = false;

var app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
