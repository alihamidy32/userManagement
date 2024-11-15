/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '../stores'
import router from '../router'
import '../styles/main.css'
import '../styles/fonts.css'
import 'leaflet/dist/leaflet.css'
// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
}
