import s from './SimpleButton.module.scss';

type Props = {
  label: React.ReactNode;
  onClick: () => void;
};
export const SimpleButton = ({ label, onClick }: Props) => {
  return (
    <button className={s.button} onClick={onClick}>
      {label}
    </button>
  );
};
