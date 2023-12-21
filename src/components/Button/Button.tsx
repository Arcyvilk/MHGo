import { modifiers } from '../../utils/modifiers';
import s from './Button.module.scss';

enum Variant {
  DEFAULT = 'default',
  DANGER = 'danger',
  ACTION = 'action',
}
type Props = {
  label: React.ReactNode;
  variant?: Variant;
  simple?: boolean;
  onClick: () => void;
};
export const Button = ({
  label,
  variant = Variant.DEFAULT,
  simple = false,
  onClick,
}: Props) => {
  return (
    <button
      className={modifiers(s, 'button', variant, { simple })}
      onClick={onClick}>
      <div className={s.button__label}>{label}</div>
    </button>
  );
};

Button.Variant = Variant;
