import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

const app = createApp();
console.log(app.config);
app.config.devtools = process.env.NODE_ENV === 'development' 
createApp(App).use(store).mount('#app')
window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor
app.config.productTip = true;
app.config.devtools = true;