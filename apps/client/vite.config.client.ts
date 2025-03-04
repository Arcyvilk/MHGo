import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';
import { SENTRY_AUTH_TOKEN } from './env';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          // svgr options
        },
      }),
      VitePWA({
        includeAssets: [
          'apple-touch-icon.png',
          'favicon.ico',
          'favicon-16x16.png',
          'favicon-32x32.png',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'pwa-maskable-192x192.png',
          'pwa-maskable-512x512.png',
        ],
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'],
        },
        manifest: {
          name: 'Master Hoarder GO',
          short_name: 'MHGo',
          description: 'Add description later',
          theme_color: '#f6eeda',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        // devOptions: {
        //   enabled: true,
        //   type: 'module',
        // },
      }),
      sentryVitePlugin({
        org: 'mhgo',
        project: 'client',
        authToken: env.VITE_SENTRY_AUTH_TOKEN,
      }),
    ],

    build: {
      sourcemap: true,
    },
  };
});
