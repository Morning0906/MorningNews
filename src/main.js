import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import directiveObj from '@/utils/directive'
// 适配，设置根标签字体大小（移动端适配）
import 'amfe-flexible'
import './VueComponent'
import '@/utils/console.js'

// 执行目标对象里install方法并传入Vue类
Vue.use(directiveObj)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
