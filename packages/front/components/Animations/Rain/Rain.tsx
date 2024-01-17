import { chooseRandom } from '@mhgo/utils';
import { useInterval } from '../../../hooks/useInterval';

import s from './Rain.module.scss';
import { addCdnUrl } from '../../..';

type ParticleType = 'HEART' | 'COIN';

type RainProps = {
  type: ParticleType;
  isRaining: boolean;
};

export const Rain = ({ type, isRaining }: RainProps) => {
  useInterval(
    () => {
      createParticle();
    },
    isRaining ? 250 : null,
  );

  const createParticle = () => {
    const particle = document.createElement('img');
    particle.src = chooseRandom(PARTICLES[type]);
    particle.classList.add(s.particle);
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = Math.random() * 5 + 3 + 's ';
    // heart.innerText = "🦄";
    const wrapper = document.getElementById('rainWrapper');
    if (wrapper) {
      wrapper.appendChild(particle);
      setTimeout(() => {
        particle.remove();
      }, 5000);
    }
  };

  return <div className={s.rain} id="rainWrapper" />;
};

const PARTICLES: Record<ParticleType, string[]> = {
  HEART: ['https://pngimg.com/uploads/heart/heart_PNG51335.png'],
  COIN: new Array(8)
    .fill(0)
    .map((_, i) => addCdnUrl(`/particles/coins/coin0${i + 1}.png`)),
};
