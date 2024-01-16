import { CDN_URL } from '../../env';

/**
 * ALL THE MUSIC!
 */
export enum SoundBG {
  BEWITCHING = 'BEWITCHING',
  EDGE_OF_THE_GALAXY = 'EDGE_OF_THE_GALAXY',
  HORROR_CREEPY = 'HORROR_CREEPY',
  LOCAL_FORECAST = 'LOCAL_FORECAST',
  SNOW_AND_CHILDREN = 'SNOW_AND_CHILDREN',
}

export const musicSrc: Record<SoundBG, string> = {
  [SoundBG.BEWITCHING]: `${CDN_URL}/music/bewitching.mp3`,
  [SoundBG.EDGE_OF_THE_GALAXY]: `${CDN_URL}/music/edge_of_the_galaxy.mp3`,
  [SoundBG.HORROR_CREEPY]: `${CDN_URL}/music/horror_creepy.mp3`,
  [SoundBG.LOCAL_FORECAST]: `${CDN_URL}/music/elevator.mp3`,
  [SoundBG.SNOW_AND_CHILDREN]: `${CDN_URL}/music/snow_and_children.mp3`,
};
