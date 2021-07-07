import Vue from 'vue'
import App from './App'
import requset from './utils/request.js'
import store from './store/index.js'
Vue.config.productionTip = false

App.mpType = 'app'
Vue.prototype.$API = requset
const app = new Vue({
	store,
	...App
})
app.$mount()
