import { useLocalStorage } from '@mhgo/front';

export type Volume = 'master' | 'bgm' | 'se';
export const DEFAULT_VOLUME = {
  master: 50,
  bgm: 50,
  se: 50,
};

export const useVolume = () => {
  const [volume, setVolume] = useLocalStorage<Record<Volume, number>>(
    'MHGO_VOLUME',
    DEFAULT_VOLUME,
  );

  return { volume, setVolume };
};
