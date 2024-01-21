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

export const soundSrcRaw = [
  [SoundSE.DOG_EATING, `${CDN_URL}/sounds/dog_eating.mp3`],
  [SoundSE.OPERA_DOG, `${CDN_URL}/sounds/opera_dog.mp3`],
  [SoundSE.BELT, `${CDN_URL}/sounds/belt.wav`],
  [SoundSE.BUBBLE, `${CDN_URL}/sounds/bubble.wav`],
  [SoundSE.CLICK, `${CDN_URL}/sounds/snap.wav`],
  [SoundSE.CRYSTAL, `${CDN_URL}/sounds/crystal.wav`],
  [SoundSE.DEATH, `${CDN_URL}/sounds/death.wav`],
  [SoundSE.NUKE, `${CDN_URL}/sounds/nuke.mp3`],
  [SoundSE.OUCH, `${CDN_URL}/sounds/ouch.wav`],
  [SoundSE.PUNCH, `${CDN_URL}/sounds/punch.mp3`],
  [SoundSE.TADA, `${CDN_URL}/sounds/tada.mp3`],
  [SoundSE.WOOF, `${CDN_URL}/sounds/woof.mp3`],
  // BARKS
  [SoundSE.BARK01, `${CDN_URL}/sounds/bark/bark01.mp3`],
  [SoundSE.BARK02, `${CDN_URL}/sounds/bark/bark02.mp3`],
  [SoundSE.BARK03, `${CDN_URL}/sounds/bark/bark03.mp3`],
  [SoundSE.BARK04, `${CDN_URL}/sounds/bark/bark04.mp3`],
  [SoundSE.BARK05, `${CDN_URL}/sounds/bark/bark05.mp3`],
  [SoundSE.BARK06, `${CDN_URL}/sounds/bark/bark06.mp3`],
  [SoundSE.BARK07, `${CDN_URL}/sounds/bark/bark07.mp3`],
  [SoundSE.BARK08, `${CDN_URL}/sounds/bark/bark08.mp3`],
  [SoundSE.BARK09, `${CDN_URL}/sounds/bark/bark09.mp3`],
];

export const soundSrc = Object.fromEntries(
  (soundSrcRaw as [SoundSE, string][]).map(([key, src]) => [
    key,
    new Howl({ src }),
  ]),
);
