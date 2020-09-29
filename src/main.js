// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import axios from 'axios'
import router from './router'

axios.defaults.withCredentials = true
Vue.config.productionTip = false
Vue.use(ElementUI);

/* eslint-disable no-new */
/*
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})*/


Vue.prototype.$axios = axios
Vue.prototype.getCookie=function (name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
new Vue({
  el: '#app',
  data : {Bus: new Vue()},
  router,
  components: { App },
  template: '<App/>',
  render: h => h(App)
});
