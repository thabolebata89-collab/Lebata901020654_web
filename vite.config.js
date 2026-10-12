import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function standaloneHtml() {
  return {
    name: 'standalone-html',
    enforce: 'post',
    apply: 'build',
    generateBundle(_options, bundle) {
      const html = Object.values(bundle).find((file) => file.type === 'asset' && file.fileName === 'index.html')
      const script = Object.values(bundle).find((file) => file.type === 'chunk' && file.isEntry)
      const stylesheet = Object.values(bundle).find((file) => file.type === 'asset' && file.fileName.endsWith('.css'))

      if (!html || typeof html.source !== 'string' || !script) {
        throw new Error('Unable to create standalone HTML: build output is missing index.html or its entry script.')
      }

      const css = stylesheet ? String(stylesheet.source).replaceAll('/images/', './images/') : ''

      let output = html.source.replace(
        /<script\b[^>]*\bsrc="[^"]+\.js"[^>]*><\/script>/,
        () => `<script type="module">${script.code.replace(/<\/script/gi, '<\\/script')}</script>`,
      )
      if (stylesheet) {
        output = output.replace(
          /<link\b(?=[^>]*\brel="stylesheet")[^>]*>/,
          () => `<style>${css.replace(/<\/style/gi, '<\\/style')}</style>`,
        )
        delete bundle[stylesheet.fileName]
      }

      html.source = output
      delete bundle[script.fileName]
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), standaloneHtml()],
})
