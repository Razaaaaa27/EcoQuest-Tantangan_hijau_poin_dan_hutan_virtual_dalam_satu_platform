// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router'
// import store from './store'
// import './styles/main.css'


// const app = createApp(App)

// app.use(router)
// app.use(store)

// app.mount('#app')

// src/main.js - COMPLETE FIX
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/main.css'

// PERBAIKAN: Import API dari lokasi yang benar
import API from './services/api.js'

const app = createApp(App)

// PERBAIKAN: Setup API sebagai global property
app.config.globalProperties.$api = API

// OPTIONAL: Provide API untuk composition API
app.provide('api', API)

app.use(router)
app.use(store)

app.mount('#app')