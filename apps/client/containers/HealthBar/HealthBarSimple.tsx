import { modifiers } from '@mhgo/front';
import s from './HealthBar.module.scss';

type HealthBarMonster = {
  maxHP: number;
  currentHP: number;
};
export const HealthBarSimple = ({ maxHP, currentHP }: HealthBarMonster) => {
  return (
    <div className={modifiers(s, 'healthBar', { isSimple: true })}>
      <div className={modifiers(s, 'healthBar__text', { isSimple: true })}>
        {currentHP} / {maxHP}
      </div>
      <div
        className={modifiers(s, 'healthBar__fg', { isSimple: true })}
        style={{ width: `${(100 * currentHP) / maxHP}%` }}
      />
      <div className={modifiers(s, 'healthBar__bg', { isSimple: true })} />
    </div>
  );
};
