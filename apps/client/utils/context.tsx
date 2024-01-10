import {
  DEFAULT_VOLUME,
  Volume,
  useLocalStorage,
  useSessionStorage,
} from '@mhgo/front';
import React, { PropsWithChildren, useContext, useState } from 'react';

type ContextType = {
  isLoggedIn: { loggedIn: boolean };
  setIsLoggedIn: (isLoggedIn: { loggedIn: boolean }) => void;
  bearerToken: { bearer: string | null };
  setBearerToken: (bearerToken: { bearer: string | null }) => void;
  music: string | undefined;
  setMusic: (music: string | undefined) => void;
  musicVolume: number;
  setMusicVolume: (musicVolume: number) => void;
};

export const AppContextProvider = ({
  children,
}: PropsWithChildren): JSX.Element => {
  const [volume] = useLocalStorage<Record<Volume, number>>(
    'MHGO_VOLUME',
    DEFAULT_VOLUME,
  );
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage<{ loggedIn: boolean }>(
    'MHGO_LOGGED_IN',
    { loggedIn: false },
  );
  const [bearerToken, setBearerToken] = useLocalStorage<{
    bearer: string | null;
  }>('MHGO_AUTH', {
    bearer: null,
  });

  const [music, setMusic] = useState<string>();
  // TODO maybe this can be done somewhere else
  // since we use the same algorithgm in useSound
  const [musicVolume, setMusicVolume] = useState<number>(
    (volume.bgm / 100) * (volume.master / 100),
  );

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    bearerToken,
    setBearerToken,
    music,
    setMusic,
    musicVolume,
    setMusicVolume,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const AppContext = React.createContext({} as ContextType);
export const useAppContext = (): ContextType => useContext(AppContext);
