import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

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
      sentryVitePlugin({
        org: 'mhgo',
        project: 'admin',
        authToken: env.VITE_SENTRY_AUTH_TOKEN,
      }),
    ],

    build: {
      sourcemap: true,
    },
  };
});
