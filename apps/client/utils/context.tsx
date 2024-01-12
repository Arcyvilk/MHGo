import { DEFAULT_VOLUME, Volume, useLocalStorage } from '@mhgo/front';
import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

type ContextType = {
  tutorialStep: string | null;
  setTutorialStep: (tutorialStep: string) => void;
  isTutorialDummyKilled: boolean;
  setIsTutorialDummyKilled: (isTutorialDummyKilled: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
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
  const [tutorialStep, setTutorialStep] = useState(null);
  const [isTutorialDummyKilled, setIsTutorialDummyKilled] = useState(false);
  const [volume] = useLocalStorage<Record<Volume, number>>(
    'MHGO_VOLUME',
    DEFAULT_VOLUME,
  );
  const [bearerToken, setBearerToken] = useLocalStorage<{
    bearer: string | null;
  }>('MHGO_AUTH', {
    bearer: null,
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    Boolean(bearerToken.bearer),
  );

  useEffect(() => {
    setIsLoggedIn(Boolean(bearerToken.bearer));
  }, [bearerToken.bearer]);

  const [music, setMusic] = useState<string>();
  // TODO maybe this can be done somewhere else
  // since we use the same algorithgm in useSound
  const [musicVolume, setMusicVolume] = useState<number>(
    (volume.bgm / 100) * (volume.master / 100),
  );

  const value = {
    tutorialStep,
    setTutorialStep,
    isTutorialDummyKilled,
    setIsTutorialDummyKilled,
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
