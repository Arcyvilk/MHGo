import { useEffect } from 'react';
import { useInterval } from '../../../hooks/useInterval';

import s from './Rain.module.scss';

type RainProps = {
  isRaining: boolean;
  setIsRaining: (isRaining: boolean) => void;
};

export const Rain = ({ isRaining, setIsRaining }: RainProps) => {
  useInterval(
    () => {
      createParticle();
    },
    isRaining ? 100 : null,
  );

  const createParticle = () => {
    const particle = document.createElement('img');
    particle.src = 'https://pngimg.com/uploads/heart/heart_PNG51335.png';
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
