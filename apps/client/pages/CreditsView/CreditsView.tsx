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
            <li>
              <a href={i.link} target="_blank">
                {i.author} - {i.title}
              </a>{' '}
              - {i.usage}
            </li>
          ))}
        </ul>

        {/* MUSIC */}
        <h2 className={s.creditsView__title}>Music</h2>
        <ul className={s.creditsView__list}>
          {music.map(m => (
            <li>
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
            <li>
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
    title: 'Whip',
    author: 'UNIVERSFIELD',
    link: 'https://pixabay.com/sound-effects/whip-123738/',
    license: 'https://pixabay.com/service/license-summary/',
  },
  {
    // Not used
    usage: 'slapping sound 1',
    title: 'belt',
    author: 'nuncaconoci',
    link: 'https://freesound.org/people/nuncaconoci/sounds/534553/',
    license: 'CC0 1.0 Deed',
  },
  {
    // Not used
    usage: 'slapping sound 2',
    title: 'Punch',
    author: 'ethanchase7744',
    link: 'https://freesound.org/people/ethanchase7744/sounds/448982/',
    license: 'CC0 1.0 Deed',
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
    // Not used
    usage: 'slapping sound 3',
    title: 'Whipslap-P',
    author: 'Seidhepriest',
    link: 'https://freesound.org/people/Seidhepriest/sounds/192077/',
    license: 'CC BY-NC 4.0 Deed',
  },
  {
    // Not used
    usage: 'slapping sound 4',
    title: 'Impact LeatherBelt 001',
    author: 'DWOBoyle',
    link: 'https://freesound.org/people/DWOBoyle/sounds/144266/',
    license: 'CC BY 4.0 Deed',
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
    usage: 'alternative click sound',
    title: 'Mechanical Switch',
    author: 'Jagadamba',
    link: 'https://freesound.org/people/Jagadamba/sounds/254286/',
    license: 'CC BY-NC 4.0 Deed',
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
