import { useMemo, useRef } from 'react';
import { Howl } from 'howler';

import { useLocalStorage } from './useLocalStorage';
import { CDN_URL } from '../env';

export type Volume = 'master' | 'bgm' | 'se';
export const DEFAULT_VOLUME = {
  master: 50,
  bgm: 50,
  se: 50,
};
export enum SoundBG {
  BEWITCHING,
}
export enum SoundSE {
  NUKE,
  CRYSTAL,
  BELT,
  PUNCH,
  OUCH,
  DEATH,
  WHIP,
  SLAP,
  BUBBLE,
}

type AppSounds = {
  bgm: Record<SoundBG, Howl>;
  se: Record<SoundSE, Howl>;
};
export const useSounds = () => {
  const [volume, setVolume] = useLocalStorage<Record<Volume, number>>(
    'MHGO_VOLUME',
    DEFAULT_VOLUME,
  );
  const bgMusic = useRef<Howl>();

  const sounds: AppSounds = useMemo(
    () => ({
      bgm: {
        [SoundBG.BEWITCHING]: new Howl({
          src: [`${CDN_URL}/sounds/bewitching.mp3`],
        }),
      },
      se: {
        [SoundSE.NUKE]: new Howl({
          src: [`${CDN_URL}/sounds/nuke.mp3`],
          html5: true,
        }),
        [SoundSE.CRYSTAL]: new Howl({ src: [`${CDN_URL}/sounds/crystal.wav`] }),
        [SoundSE.BELT]: new Howl({ src: [`${CDN_URL}/sounds/belt.wav`] }),
        [SoundSE.PUNCH]: new Howl({ src: [`${CDN_URL}/sounds/punch.wav`] }),
        [SoundSE.OUCH]: new Howl({ src: [`${CDN_URL}/sounds/ouch.wav`] }),
        [SoundSE.DEATH]: new Howl({ src: [`${CDN_URL}/sounds/death.wav`] }),
        [SoundSE.WHIP]: new Howl({ src: [`${CDN_URL}/sounds/whip.wav`] }),
        [SoundSE.SLAP]: new Howl({ src: [`${CDN_URL}/sounds/slap.wav`] }),
        [SoundSE.BUBBLE]: new Howl({ src: [`${CDN_URL}/sounds/bubble.wav`] }),
      },
    }),
    [],
  );

  const changeMusic = (sound: SoundBG) => {
    if (bgMusic.current) {
      bgMusic.current.pause();
    }
    bgMusic.current = sounds.bgm[sound];
    bgMusic.current.volume((volume.bgm / 100) * (volume.master / 100));
    bgMusic.current.loop(true);
    bgMusic.current.play();
  };

  const changeMusicVolume = () => {
    if (!bgMusic.current) return;
    bgMusic.current.pause();
    const newVolume = (volume.bgm / 100) * (volume.master / 100);
    bgMusic.current.volume(newVolume);
    bgMusic.current.play();
  };

  const playSESound = (sound: SoundSE, loop: boolean = false) => {
    const audio = sounds.se[sound];
    audio.volume((volume.se / 100) * (volume.master / 100));
    audio.loop(loop);
    audio.play();
  };

  return {
    playSESound,
    changeMusic,
    changeMusicVolume,
    volume,
    setVolume,
  };
};
