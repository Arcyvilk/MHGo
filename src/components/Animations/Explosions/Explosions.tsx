// @ts-ignore
import ExplosionTicao from 'react-explode/Ticao';
// @ts-ignore
import ExplosionNegros from 'react-explode/Negros';
// @ts-ignore
import ExplosionBoracay from 'react-explode/Boracay';

import s from './Explosions.module.scss';

export const Explosions = () => {
  return (
    <div className={s.explosions}>
      <ExplosionTicao size="600" delay={0} repeatDelay={0} repeat={0} />
      <ExplosionNegros size="600" delay={0} repeatDelay={0} repeat={0} />
      <ExplosionBoracay size="600" delay={0} repeatDelay={0} repeat={0} />
    </div>
  );
};
