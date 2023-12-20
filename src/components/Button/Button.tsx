import { modifiers } from '../../utils/modifiers';
import s from './Button.module.scss';

enum Variant {
  DEFAULT = 'default',
  DANGER = 'danger',
}
type Props = {
  label: React.ReactNode;
  variant?: Variant;
  onClick: () => void;
};
export const Button = ({
  label,
  variant = Variant.DEFAULT,
  onClick,
}: Props) => {
  return (
    <button className={modifiers(s, 'button', variant)} onClick={onClick}>
      <div className={s.button__label}>{label}</div>
    </button>
  );
};

Button.Variant = Variant;
