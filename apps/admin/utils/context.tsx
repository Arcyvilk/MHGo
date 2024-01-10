import React, { PropsWithChildren, useContext, useMemo } from 'react';
import { useLocalStorage } from '@mhgo/front';

type ContextType = {
  isLoggedIn: boolean;
  bearerToken: { bearer: string | null };
  setBearerToken: (bearerToken: { bearer: string | null }) => void;
};

export const AppContextProvider = ({
  children,
}: PropsWithChildren): JSX.Element => {
  const [bearerToken, setBearerToken] = useLocalStorage<{
    bearer: string | null;
  }>('MHGO_AUTH', {
    bearer: null,
  });

  const isLoggedIn = useMemo<boolean>(
    () => Boolean(bearerToken.bearer),
    [bearerToken?.bearer],
  );

  const value = {
    isLoggedIn,
    bearerToken,
    setBearerToken,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const AppContext = React.createContext({} as ContextType);
export const useAppContext = (): ContextType => useContext(AppContext);
