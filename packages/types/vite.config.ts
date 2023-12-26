import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    // generate .vite/manifest.json in outDir
    manifest: true,
    rollupOptions: {
      // overwrite default .html entry
      input: './index.ts',
    },
  },
  plugins: [
    ...VitePluginNode({
      adapter: 'express',
      appPath: './index.ts',
      exportName: '@mhgo/types',
      tsCompiler: 'esbuild',
    }),
  ],
});
