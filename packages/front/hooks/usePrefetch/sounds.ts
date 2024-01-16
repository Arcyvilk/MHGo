import { Howl } from 'howler';
import { CDN_URL } from '../../env';

/**
 * ALL THE SOUNDS!
 */
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
  TADA = 'TADA',
  WOOF = 'WOOF',
  // BARKS
  BARK01 = 'BARK01',
  BARK02 = 'BARK02',
  BARK03 = 'BARK03',
  BARK04 = 'BARK04',
  BARK05 = 'BARK05',
  BARK06 = 'BARK06',
  BARK07 = 'BARK07',
  BARK08 = 'BARK08',
  BARK09 = 'BARK09',
}

export const soundSrc: Record<SoundSE, Howl> = {
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
  [SoundSE.TADA]: new Howl({ src: [`${CDN_URL}/sounds/tada.mp3`] }),
  [SoundSE.WOOF]: new Howl({ src: [`${CDN_URL}/sounds/woof.mp3`] }),
  // BARKS
  [SoundSE.BARK01]: new Howl({ src: [`${CDN_URL}/sounds/bark/bark01.mp3`] }),
  [SoundSE.BARK02]: new Howl({ src: [`${CDN_URL}/sounds/bark/bark02.mp3`] }),
  [SoundSE.BARK03]: new Howl({ src: [`${CDN_URL}/sounds/bark/bark03.mp3`] }),
  [SoundSE.BARK04]: new Howl({ src: [`${CDN_URL}/sounds/bark/bark04.mp3`] }),
  [SoundSE.BARK05]: new Howl({ src: [`${CDN_URL}/sounds/bark/bark05.mp3`] }),
  [SoundSE.BARK06]: new Howl({ src: [`${CDN_URL}/sounds/bark/bark06.mp3`] }),
  [SoundSE.BARK07]: new Howl({ src: [`${CDN_URL}/sounds/bark/bark07.mp3`] }),
  [SoundSE.BARK08]: new Howl({ src: [`${CDN_URL}/sounds/bark/bark08.mp3`] }),
  [SoundSE.BARK09]: new Howl({ src: [`${CDN_URL}/sounds/bark/bark09.mp3`] }),
};
