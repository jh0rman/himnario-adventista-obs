import pluginTailwind from 'bun-plugin-tailwind'
import { pluginVue3 } from 'bun-plugin-vue3'

Bun.build({
  entrypoints: ['./index.html'],
  outdir: './dist',
  minify: true,
  define: {
    __VUE_OPTIONS_API__: 'false',
    __VUE_PROD_DEVTOOLS__: 'false',
  },
  plugins: [pluginVue3(), pluginTailwind],
})
