import Vue from 'vue'
import Vuetify from 'vuetify'

import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'vuetify/dist/vuetify.min.css'

import App from './App.vue'

Vue.config.productionTip = false

Vue.use(Vuetify, {
  iconfont: 'md'
})

new Vue({
  render: h => h(App),
}).$mount('#app')

