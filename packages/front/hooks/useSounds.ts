import { chooseRandom } from '@mhgo/utils';

import { LSKeys, useLocalStorage } from './useLocalStorage';
import { SoundSE, SoundBG, soundSrc, musicSrc } from './usePrefetch';

export type Volume = 'master' | 'bgm' | 'se';
export const DEFAULT_VOLUME = {
  master: 50,
  bgm: 50,
  se: 50,
};
export const DEFAULT_CACHE_ID = { id: String(Date.now()) };

export const useSounds = (
  setMusic: ((music: string | undefined) => void) | undefined,
) => {
  const [volume, setVolume] = useLocalStorage<Record<Volume, number>>(
    LSKeys.MHGO_VOLUME,
    DEFAULT_VOLUME,
  );

  const changeMusic = (musicPath: SoundBG) => {
    if (!setMusic) return;
    changeMusicVolume();
    const newMusic = musicSrc[musicPath];
    setMusic(newMusic);
  };

  const changeMusicVolume = () => {
    const musicVolume = (volume.bgm / 100) * (volume.master / 100);
    return musicVolume;
  };

  const playSound = (sound: SoundSE, loop: boolean = false) => {
    const audio = soundSrc[sound];
    audio.volume((volume.se / 100) * (volume.master / 100));
    audio.loop(loop);
    audio.play();
  };

  const playRandomSound = (sounds: SoundSE[], loop: boolean = false) => {
    const sound = chooseRandom(sounds);
    playSound(sound, loop);
  };

  return {
    playSound,
    playRandomSound,
    changeMusic,
    changeMusicVolume,
    volume,
    setVolume,
  };
};
