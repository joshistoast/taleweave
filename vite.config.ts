import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import unoConfig from './uno.config'

export default defineConfig({
  plugins: [
    UnoCSS(unoConfig),
    sveltekit(),
  ],
})
