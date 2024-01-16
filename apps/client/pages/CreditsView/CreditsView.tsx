import { CloseButton } from '@mhgo/front';

import s from './CreditsView.module.scss';

export const CreditsView = () => {
  return (
    <div className={s.creditsView}>
      <div className={s.header}>
        <div className={s.header__title}>Credits</div>
      </div>
      <div className={s.creditsView__wrapper}>
        {/* IMAGES */}
        <h2 className={s.creditsView__title}>Images</h2>
        <ul className={s.creditsView__list}>
          {images.map(i => (
            <li key={`credits-image-${i.title}`}>
              <a href={i.link} target="_blank">
                {i.author} - {i.title}
              </a>{' '}
              - {i.usage}
            </li>
          ))}
        </ul>
        <div className={s.creditsView__description}>
          All images not listed here are either drawn by me, or generated with
          the{' '}
          <a href="https://dreamstudio.ai/" target="_blank">
            Stable Diffusion AI
          </a>{' '}
          and under the Creative ML OpenRAIL-M license.
        </div>

        {/* MUSIC */}
        <h2 className={s.creditsView__title}>Music</h2>
        <ul className={s.creditsView__list}>
          {music.map(m => (
            <li key={`credits-music-${m.title}`}>
              <a href={m.link} target="_blank">
                {m.author} - {m.title}
              </a>{' '}
              - {m.usage}
            </li>
          ))}
        </ul>

        {/* SOUNDS */}
        <h2 className={s.creditsView__title}>Sounds</h2>
        <ul className={s.creditsView__list}>
          {sounds.map(s => (
            <li key={`credits-sound-${s.title}`}>
              <a href={s.link} target="_blank">
                {s.author} - {s.title}
              </a>{' '}
              - {s.usage}
            </li>
          ))}
        </ul>
      </div>
      <CloseButton />
    </div>
  );
};

type Credit = {
  usage: string;
  title: string;
  author: string;
  link: string;
  license: string;
};

const images: Credit[] = [
  {
    usage: 'happy birthday art',
    title: 'Meowscular Chef',
    author: 'Agroshka',
    link: 'https://agroshka.tumblr.com/',
    license: 'https://choosealicense.com/no-permission/',
  },
  {
    usage: 'resource/item/material icons',
    title: 'Monster Hunter',
    author: 'Capcom',
    link: 'https://fanonmonsterhunter.fandom.com/wiki/Item_Icon_List',
    license: '',
  },
];
const sounds: Credit[] = [
  {
    usage: 'nuke sound',
    title: 'Explosion 003',
    author: 'cydon',
    link: 'https://freesound.org/people/cydon/sounds/268555/',
    license: 'CC BY-NC 4.0 Deed',
  },
  {
    usage: 'resource farm sound',
    title: 'snd fragment retrieve',
    author: 'rocker12523',
    link: 'https://freesound.org/people/rocker12523/sounds/678497/',
    license: 'CC0 1.0 Deed',
  },
  {
    usage: 'monster hit sound',
    title: 'Punch sound effect',
    author: 'Swiggity',
    link: 'https://www.youtube.com/watch?v=VfMy7U-q3-Y',
    license: '?',
  },
  {
    usage: 'pain grunt',
    title: 'Ouch',
    author: 'ajanhallinta',
    link: 'https://freesound.org/people/ajanhallinta/sounds/649543/',
    license: 'CC0 1.0 Deed',
  },
  {
    usage: 'death grunt',
    title: 'Man dies',
    author: 'starkvind',
    link: 'https://freesound.org/people/starkvind/sounds/559975/',
    license: 'CC0 1.0 Deed',
  },
  {
    usage: 'item use sound',
    title: 'bubble',
    author: 'JavierSerrat',
    link: 'https://freesound.org/people/JavierSerrat/sounds/485065/',
    license: 'CC BY 4.0 Deed',
  },
  {
    usage: 'click sound',
    title: 'Snap Click 01',
    author: 'ironcross32',
    link: 'https://freesound.org/people/ironcross32/sounds/582898/',
    license: 'CC0 1.0 DEED',
  },
  {
    usage: 'achievement fanfare',
    title: 'Tada Fanfare G',
    author: 'plasterbrain',
    link: 'https://freesound.org/people/plasterbrain/sounds/397353/',
    license: 'CC0 1.0 DEED',
  },
  {
    usage: 'woof',
    title: 'WoofSmall2',
    author: 'Wdomino',
    link: 'https://freesound.org/people/Wdomino/sounds/517131/',
    license: 'CC0 1.0 DEED',
  },
  {
    usage: "frendoggo's battlehymn",
    title: 'Born to be opera singer',
    author: 'Nicolas&Us',
    link: 'https://www.tiktok.com/@nicolas_us/video/6993750339266645253',
    license: '?',
  },
  {
    usage: 'sound of eating frendoggo',
    title: 'Eating Dog 2',
    author: 'SpaceJoe',
    link: 'https://freesound.org/people/SpaceJoe/sounds/483036/',
    license: 'CC0 1.0 DEED',
  },
];

const music: Credit[] = [
  {
    usage: 'background music',
    title: 'Snow and Children',
    author: 'MusMus',
    link: 'https://musmus.main.jp/',
    license: 'https://musmus.main.jp/info.html',
  },
  {
    usage: 'fight music',
    title: 'Edge of the Galaxy',
    author: 'MusMus',
    link: 'https://musmus.main.jp/',
    license: 'https://musmus.main.jp/info.html',
  },
  {
    usage: 'idle shop music',
    title: 'Local Forecast - Elevator',
    author: 'Kevin MacLeod',
    link: 'https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1300012',
    license: 'CC BY 3.0 DEED',
  },
  {
    usage: 'death music',
    title: 'Horror/Creepy sound atmosphere ambience (Spectral) - 02',
    author: 'bolkmar',
    link: 'https://freesound.org/people/bolkmar/sounds/417497/',
    license: 'Attribution 3.0',
  },
];
