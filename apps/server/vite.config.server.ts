import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    // generate .vite/manifest.json in outDir
    manifest: true,

    rollupOptions: {
      // overwrite default .html entry
      input: './api.ts',
    },

    sourcemap: true
  },
  plugins: [...VitePluginNode({
    adapter: 'express',
    appPath: './api.ts',
    exportName: 'mhgoServer',
    tsCompiler: 'esbuild',
  }), sentryVitePlugin({
    org: "mhgo",
    project: "node-express"
  })],
});