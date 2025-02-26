import * as Sentry from '@sentry/react';

export const initializeSentry = () => {
  Sentry.init({
    dsn: 'https://b0a5a3d35f22680c565b117bfa8e2d35@o4508887880826880.ingest.de.sentry.io/4508887890722896',
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: [
      /^https:\/\/app\.masterhoarder\.io/,
      /^https:\/\/admin\.masterhoarder\.io/,
      /^https:\/\/api\.masterhoarder\.io/,
    ],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
};
