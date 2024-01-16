import s from './HealthBar.module.scss';

type HealthBarMonster = {
  maxHP: number;
  currentHP: number;
};
export const HealthBarMonster = ({ maxHP, currentHP }: HealthBarMonster) => {
  const roundedCurrentHP = Math.round(currentHP);
  return (
    <div className={s.healthBar}>
      <div className={s.healthBar__text}>
        {roundedCurrentHP} / {maxHP}
      </div>
      <div
        className={s.healthBar__fg}
        style={{ width: `${(100 * Math.round(roundedCurrentHP)) / maxHP}%` }}
      />
      <div className={s.healthBar__bg} />
    </div>
  );
};
