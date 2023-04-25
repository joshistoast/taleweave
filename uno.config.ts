import { defineConfig } from 'unocss/vite'
import presetIcons from '@unocss/preset-icons'
import presetUno from '@unocss/preset-uno'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  mode: 'svelte-scoped',
  transformers: [
    transformerDirectives(),
  ],
  theme: {
    colors: {
      'gray': presetUno().theme?.colors['neutral'],
    },
  },
  presets: [
    presetUno(),
    presetIcons({
      prefix: 'i-',
      extraProperties: {
        'color': 'inherit',
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
})
