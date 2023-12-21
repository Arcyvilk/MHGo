import s from './FightView.module.scss';

export const ModalFailure = () => {
  return (
    <div className={s.result}>
      <h1 className={s.result__title}>Failure!</h1>
      <div className={s.result__content}>
        You're such a noob that you died in a clicker game ._. Heal yourself and
        try again to defend your honour.
      </div>
    </div>
  );
};
