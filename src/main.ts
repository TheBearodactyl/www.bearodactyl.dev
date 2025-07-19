import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import { createHead } from '@unhead/vue/server'

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
  },
})

const head = createHead()
const app = createApp(App)
app.use(head)
app.use(router)
app.use(i18n)
app.mount('#app')
