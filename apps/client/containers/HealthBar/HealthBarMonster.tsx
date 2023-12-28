import s from './HealthBar.module.scss';

type HealthBarMonster = {
  maxHP: number;
  currentHP: number;
};
export const HealthBarMonster = ({ maxHP, currentHP }: HealthBarMonster) => {
  return (
    <div className={s.healthBar}>
      <div className={s.healthBar__text}>
        {currentHP} / {maxHP}
      </div>
      <div
        className={s.healthBar__fg}
        style={{ width: `${(100 * currentHP) / maxHP}%` }}
      />
      <div className={s.healthBar__bg} />
    </div>
  );
};
