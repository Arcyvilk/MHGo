import * as Sentry from '@sentry/react';

import ReactDOM from 'react-dom/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import { AppContextProvider } from './utils/context';
import { Router } from './Router.tsx';

import 'tippy.js/dist/tippy.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.scss';

Sentry.init({
  dsn: 'https://6f929523d8567464b6a81c2173b857b1@o4508887880826880.ingest.de.sentry.io/4508888000036944',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
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
