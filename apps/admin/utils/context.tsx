import React, { PropsWithChildren, useContext } from 'react';
import { useLocalStorage } from '@mhgo/front';

type ContextType = {
  isLoggedIn: { loggedIn: boolean };
  setIsLoggedIn: (isLoggedIn: { loggedIn: boolean }) => void;
  bearerToken: { bearer: string | null };
  setBearerToken: (bearerToken: { bearer: string | null }) => void;
};

export const AppContextProvider = ({
  children,
}: PropsWithChildren): JSX.Element => {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage<{ loggedIn: boolean }>(
    'MHGO_LOGGED_IN',
    { loggedIn: false },
  );
  const [bearerToken, setBearerToken] = useLocalStorage<{
    bearer: string | null;
  }>('MHGO_AUTH', {
    bearer: null,
  });

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    bearerToken,
    setBearerToken,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const AppContext = React.createContext({} as ContextType);
export const useAppContext = (): ContextType => useContext(AppContext);
