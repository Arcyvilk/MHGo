import s from './ActionBar.module.scss';

export const ActionBar = ({
  title,
  buttons,
}: {
  title?: string;
  buttons: React.ReactNode;
}) => {
  return (
    <div className={s.actionBar}>
      {title ? <h2 className={s.actionBar__title}>{title}</h2> : <span />}
      <div className={s.actionBar__buttons}>{buttons}</div>
    </div>
  );
};
