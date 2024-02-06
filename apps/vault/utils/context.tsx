import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { DEFAULT_CACHE_ID, LSKeys, useLocalStorage } from '@mhgo/front';

type ContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  bearerToken: { bearer: string | null };
  setBearerToken: (bearerToken: { bearer: string | null }) => void;
  // CACHING
  cacheId: { id: string };
  setCacheId: (cacheId: { id: string }) => void;
  // CHOOSING ADVENTURE
  adventure: { id: string };
  setAdventure: (adventure: { id: string }) => void;
};

export const AppContextProvider = ({
  children,
}: PropsWithChildren): JSX.Element => {
  const [bearerToken, setBearerToken] = useLocalStorage<{
    bearer: string | null;
  }>(LSKeys.MHGO_AUTH, {
    bearer: null,
  });
  const [adventure, setAdventure] = useLocalStorage<{
    id: string;
  }>(LSKeys.MHGO_ADVENTURE, {
    id: 'mhgo',
  });
  const [cacheId, setCacheId] = useLocalStorage<{
    id: string;
  }>(LSKeys.MHGO_CACHE_ID, DEFAULT_CACHE_ID);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    Boolean(bearerToken.bearer),
  );

  useEffect(() => {
    setIsLoggedIn(Boolean(bearerToken.bearer));
  }, [bearerToken.bearer]);

  useEffect(() => {
    if (!cacheId?.id) {
      setCacheId({ id: String(Date.now()) });
    }
  }, [cacheId]);

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    bearerToken,
    setBearerToken,
    // CACHING
    cacheId,
    setCacheId,
    // ADVENTURE
    adventure,
    setAdventure,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const AppContext = React.createContext({} as ContextType);
export const useAppContext = (): ContextType => useContext(AppContext);
