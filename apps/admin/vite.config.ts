import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        // svgr options
      },
    }),
    sentryVitePlugin({
      org: 'mhgo',
      project: 'mhgo-admin',
    }),
  ],

  build: {
    sourcemap: true,
  },
});
