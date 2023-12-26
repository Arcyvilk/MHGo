import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';

import { App } from './App.tsx';

import 'react-toastify/dist/ReactToastify.css';
import './index.scss';

if ('serviceWorker' in navigator) {
  registerSW({
    immediate: true,
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  // Strict mode causes stuff to render twice and some endpoints get called twice
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
  <>
    <App />
  </>,
);
