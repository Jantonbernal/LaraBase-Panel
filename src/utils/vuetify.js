// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
// Translations provided by Vuetify
import { es } from 'vuetify/locale'

import '@fontsource/roboto/400-italic.css'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  locale: {
    locale: 'es',
    fallback: 'en',
    messages: { es },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: false,
        colors: {
          background: '#3c3d50',
          surface: '#3c3d50',
          primary: '#2AB7A9',
          secondary: '#3281c1',
          error: '#fb977d',
          info: '#899dad',
          success: '#4bd08b',
          warning: '#f8c076',
        },
      },
    },
  },
})

export default vuetify
