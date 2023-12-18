import { defineConfig } from 'vite'
import { VitePluginNode } from 'vite-plugin-node'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    ...VitePluginNode({
      adapter: 'express',
      appPath: './server/index.ts',
      exportName: 'mhgoServer',
      tsCompiler: 'esbuild'
    })
  ]
})
