import { DEFAULT_VOLUME, Volume, useLocalStorage } from '@mhgo/front';
import React, { PropsWithChildren, useContext, useState } from 'react';

type ContextType = {
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

  const [music, setMusic] = useState<string>();
  // TODO maybe this can be done somewhere else
  // since we use the same algorithgm in useSound
  const [musicVolume, setMusicVolume] = useState<number>(
    (volume.bgm / 100) * (volume.master / 100),
  );

  const value = { music, setMusic, musicVolume, setMusicVolume };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const AppContext = React.createContext({} as ContextType);
export const useAppContext = (): ContextType => useContext(AppContext);
