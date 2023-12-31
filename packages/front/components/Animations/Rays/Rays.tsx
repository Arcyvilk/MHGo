import { modifiers } from '@mhgo/front';
import s from './Rays.module.scss';

export const Rays = () => {
  return (
    <div className={s.center}>
      <div className={s.rayBox}>
        <div className={modifiers(s, 'ray', '1')}></div>
        <div className={modifiers(s, 'ray', '2')}></div>
        <div className={modifiers(s, 'ray', '3')}></div>
        <div className={modifiers(s, 'ray', '4')}></div>
        <div className={modifiers(s, 'ray', '5')}></div>
        <div className={modifiers(s, 'ray', '6')}></div>
        <div className={modifiers(s, 'ray', '7')}></div>
        <div className={modifiers(s, 'ray', '8')}></div>
        <div className={modifiers(s, 'ray', '9')}></div>
        <div className={modifiers(s, 'ray', '10')}></div>
      </div>
    </div>
  );
};
