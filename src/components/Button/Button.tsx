import s from './Button.module.scss';

type Props = {
  label: React.ReactNode;
  onClick: () => void;
};
export const Button = ({ label, onClick }: Props) => {
  return (
    <button className={s.button} onClick={onClick}>
      {label}
    </button>
  );
};
