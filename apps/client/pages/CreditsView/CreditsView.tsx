import { CloseButton } from '@mhgo/front';

import s from './CreditsView.module.scss';

export const CreditsView = () => {
  return (
    <div className={s.creditsView}>
      <div className={s.header}>
        <div className={s.header__title}>Credits</div>
      </div>
      <div className={s.creditsView__wrapper}>
        {/* MUSIC */}
        <h2 className={s.creditsView__title}>Music</h2>
        <ul className={s.creditsView__list}>
          {music.map(m => (
            <li>
              <a href={m.link} target="_blank">
                {m.author} - {m.title}
              </a>{' '}
              - used as {m.usage}
            </li>
          ))}
        </ul>

        {/* SOUNDS */}
        <h2 className={s.creditsView__title}>Sounds</h2>
        <ul className={s.creditsView__list}>
          {sounds.map(s => (
            <li>
              <a href={s.link} target="_blank">
                {s.author} - {s.title}
              </a>{' '}
              - used as {s.usage}
            </li>
          ))}
        </ul>

        {/* IMAGES */}
        <h2 className={s.creditsView__title}>Images</h2>
        <ul className={s.creditsView__list}>
          {images.map(i => (
            <li>
              <a href={i.link} target="_blank">
                {i.author} - {i.title}
              </a>{' '}
              - used as {i.usage}
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
];
const sounds: Credit[] = [
  {
    usage: 'nuke sound',
    title: '',
    author: '',
    link: '',
    license: 'TODO',
  },
  {
    usage: 'resource farm sound',
    title: '',
    author: '',
    link: '',
    license: 'TODO',
  },
  {
    usage: 'slapping sound 1',
    title: '',
    author: '',
    link: '',
    license: 'TODO',
  },
  {
    usage: 'slapping sound 2',
    title: '',
    author: '',
    link: '',
    license: 'TODO',
  },
  {
    usage: 'pain grunt',
    title: '',
    author: '',
    link: '',
    license: 'TODO',
  },
  {
    usage: 'death grunt',
    title: '',
    author: '',
    link: '',
    license: 'TODO',
  },
  {
    usage: 'slapping sound 3',
    title: '',
    author: '',
    link: '',
    license: 'TODO',
  },
  {
    usage: 'slapping sound 4',
    title: '',
    author: '',
    link: '',
    license: 'TODO',
  },
  {
    usage: 'item use sound',
    title: '',
    author: '',
    link: '',
    license: 'TODO',
  },
  {
    usage: 'click sound',
    title: 'Snap Click 01',
    author: 'ironcross32',
    link: 'https://freesound.org/people/ironcross32/sounds/582898/',
    license: 'CC0 1.0 DEED',
  },
  {
    usage: 'alternative click sound',
    title: 'Mechanical Switch',
    author: 'Jagadamba',
    link: 'https://freesound.org/people/Jagadamba/sounds/254286/',
    license: 'Attribution NonCommercial 4.0',
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
    usage: 'death music',
    title: 'Horror/Creepy sound atmosphere ambience (Spectral)- 02',
    author: 'bolkmar',
    link: 'https://freesound.org/people/bolkmar/sounds/417497/',
    license: 'Attribution 3.0',
  },
];
