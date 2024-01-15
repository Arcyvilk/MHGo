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
  BEWITCHING = 'BEWITCHING',
  EDGE_OF_THE_GALAXY = 'EDGE_OF_THE_GALAXY',
  HORROR_CREEPY = 'HORROR_CREEPY',
  LOCAL_FORECAST = 'LOCAL_FORECAST',
  SNOW_AND_CHILDREN = 'SNOW_AND_CHILDREN',
}
export enum SoundSE {
  OPERA_DOG = 'OPERA_DOG',
  DOG_EATING = 'DOG_EATING',
  BELT = 'BELT',
  BUBBLE = 'BUBBLE',
  CLICK = 'CLICK',
  CRYSTAL = 'CRYSTAL',
  DEATH = 'DEATH',
  NUKE = 'NUKE',
  OUCH = 'OUCH',
  PUNCH = 'PUNCH',
  WOOF = 'WOOF',
}

export const useSounds = (
  setMusic: ((music: string | undefined) => void) | undefined,
) => {
  const [volume, setVolume] = useLocalStorage<Record<Volume, number>>(
    'MHGO_VOLUME',
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

  return {
    playSound,
    changeMusic,
    changeMusicVolume,
    volume,
    setVolume,
  };
};

/**
 * ALL THE SOUNDS!
 */
const musicSrc: Record<SoundBG, string> = {
  [SoundBG.BEWITCHING]: `${CDN_URL}/sounds/bewitching.mp3`,
  [SoundBG.EDGE_OF_THE_GALAXY]: `${CDN_URL}/sounds/edge_of_the_galaxy.mp3`,
  [SoundBG.HORROR_CREEPY]: `${CDN_URL}/sounds/horror_creepy.mp3`,
  [SoundBG.LOCAL_FORECAST]: `${CDN_URL}/sounds/elevator.mp3`,
  [SoundBG.SNOW_AND_CHILDREN]: `${CDN_URL}/sounds/snow_and_children.mp3`,
};
const soundSrc: Record<SoundSE, Howl> = {
  [SoundSE.DOG_EATING]: new Howl({ src: [`${CDN_URL}/sounds/dog_eating.mp3`] }),
  [SoundSE.OPERA_DOG]: new Howl({ src: [`${CDN_URL}/sounds/opera_dog.mp3`] }),
  [SoundSE.BELT]: new Howl({ src: [`${CDN_URL}/sounds/belt.wav`] }),
  [SoundSE.BUBBLE]: new Howl({ src: [`${CDN_URL}/sounds/bubble.wav`] }),
  [SoundSE.CLICK]: new Howl({ src: [`${CDN_URL}/sounds/snap.wav`] }),
  [SoundSE.CRYSTAL]: new Howl({ src: [`${CDN_URL}/sounds/crystal.wav`] }),
  [SoundSE.DEATH]: new Howl({ src: [`${CDN_URL}/sounds/death.wav`] }),
  [SoundSE.NUKE]: new Howl({ src: [`${CDN_URL}/sounds/nuke.mp3`] }),
  [SoundSE.OUCH]: new Howl({ src: [`${CDN_URL}/sounds/ouch.wav`] }),
  [SoundSE.PUNCH]: new Howl({ src: [`${CDN_URL}/sounds/punch.mp3`] }),
  [SoundSE.WOOF]: new Howl({ src: [`${CDN_URL}/sounds/woof.mp3`] }),
};
