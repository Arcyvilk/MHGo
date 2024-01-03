import { useVolume } from './useVolume';
import { CDN_URL } from '../env';
import { useMemo } from 'react';

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
  bgm: Record<SoundBG, HTMLAudioElement>;
  se: Record<SoundSE, HTMLAudioElement>;
};
export const useSounds = () => {
  const { volume } = useVolume();

  const sounds: AppSounds = useMemo(
    () => ({
      bgm: {
        [SoundBG.BEWITCHING]: new Audio(`${CDN_URL}/sounds/bewitching.mp3`),
      },
      se: {
        [SoundSE.NUKE]: new Audio(`${CDN_URL}/sounds/nuke.mp3`),
        [SoundSE.CRYSTAL]: new Audio(`${CDN_URL}/sounds/crystal.wav`),
        [SoundSE.BELT]: new Audio(`${CDN_URL}/sounds/belt.wav`),
        [SoundSE.PUNCH]: new Audio(`${CDN_URL}/sounds/punch.wav`),
        [SoundSE.OUCH]: new Audio(`${CDN_URL}/sounds/ouch.wav`),
        [SoundSE.DEATH]: new Audio(`${CDN_URL}/sounds/death.wav`),
        [SoundSE.WHIP]: new Audio(`${CDN_URL}/sounds/whip.wav`),
        [SoundSE.SLAP]: new Audio(`${CDN_URL}/sounds/slap.wav`),
        [SoundSE.BUBBLE]: new Audio(`${CDN_URL}/sounds/bubble.wav`),
      },
    }),
    [],
  );

  const playBgSound = (sound: SoundBG, loop: boolean = false) => {
    const audio = sounds.bgm[sound];
    audio.volume = (volume.bgm / 100) * (volume.master / 100);
    audio.loop = loop;
    audio.play();
  };

  const playSESound = (sound: SoundSE, loop: boolean = false) => {
    const audio = sounds.se[sound];
    audio.volume = (volume.se / 100) * (volume.master / 100);
    audio.loop = loop;
    audio.play();
  };

  return { playBgSound, playSESound };
};
