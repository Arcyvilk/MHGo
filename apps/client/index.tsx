import * as Sentry from '@sentry/react';

import ReactDOM from 'react-dom/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { registerSW } from 'virtual:pwa-register';

import { AppContextProvider } from './utils/context';
import { Router } from './Router';

import 'leaflet/dist/leaflet.css';
import 'tippy.js/dist/tippy.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.scss';

Sentry.init({
  dsn: 'https://d2fff382c769403a6f9338a44a634137@o4508887880826880.ingest.de.sentry.io/4508888004493392',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
});

if ('serviceWorker' in navigator) {
  registerSW({
    immediate: true,
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  // Strict mode causes stuff to render twice and some endpoints get called twice
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
  <AppContextProvider>
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  </AppContextProvider>,
);
