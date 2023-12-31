import React, { Suspense, useState } from 'react';
import { useLocation } from 'react-router';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

type Props = {
  fallback?: React.ReactNode;
  errorFallback?: React.ReactElement | null;
  displayError?: boolean;
  children?: React.ReactNode;
  onReset?: () => void;
  onError?: (error: Error) => void;
};

export const QueryBoundary = (props: Props) => {
  const {
    fallback = null,
    errorFallback = null,
    children,
    // onReset,
    onError,
  } = props;
  const [, setError] = useState<Error | null>(null);
  const location = useLocation();
  const errorBoundaryKey = `${location.pathname}${location.search}`;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          key={errorBoundaryKey}
          onReset={reset}
          onError={(e: Error) => {
            if (onError) onError(e);
            setError(e);
          }}
          FallbackComponent={({ error, resetErrorBoundary }: any) =>
            ErrorFallback({
              error,
              resetErrorBoundary,
              errorFallback,
            })
          }>
          <Suspense fallback={fallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

const ErrorFallback = ({
  error,
  // resetErrorBoundary,
  errorFallback,
}: FallbackProps & Pick<Props, 'errorFallback'>) => {
  console.log(error);

  if (errorFallback) {
    const errorFallbackComponentWithError = React.cloneElement(errorFallback, {
      error: typeof error === 'string' ? error : error.message,
    });
    return errorFallbackComponentWithError;
  }
  return null;
};
