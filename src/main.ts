import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n'
import { createHead } from '@unhead/vue/server'

import en from '../locales/en.json'
import sp from '../locales/sp.json'
import jp from '../locales/jp.json'

export const locales = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    sp,
    jp,
  },
})

const head = createHead()
const app = createApp(App)
app.use(head)
app.use(router)
app.use(locales)
app.mount('#app')
