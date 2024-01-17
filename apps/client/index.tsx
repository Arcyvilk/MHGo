import ReactDOM from 'react-dom/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { registerSW } from 'virtual:pwa-register';

import { AppContextProvider } from './utils/context';

import 'tippy.js/dist/tippy.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.scss';
import { Router } from './router.tsx';

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
