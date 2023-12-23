import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    // generate .vite/manifest.json in outDir
    manifest: true,
    rollupOptions: {
      // overwrite default .html entry
      input: './server/api.ts',
    },
  },
  plugins: [
    ...VitePluginNode({
      adapter: 'express',
      appPath: './server/api.ts',
      exportName: 'mhgoServer',
      tsCompiler: 'esbuild',
    }),
  ],
});
