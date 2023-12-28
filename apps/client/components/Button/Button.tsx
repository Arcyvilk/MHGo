import { Tooltip } from '..';
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
  disabled?: boolean;
  simple?: boolean;
  title?: string | null;
  onClick: () => void;
};
export const Button = ({
  label,
  variant = Variant.DEFAULT,
  disabled = false,
  simple = false,
  title,
  onClick,
}: Props) => {
  const btn = (
    <button
      className={modifiers(s, 'button', variant, { simple, disabled })}
      onClick={onClick}
      disabled={disabled}
      style={{ width: '100%' }}>
      <div className={s.button__label}>{label}</div>
    </button>
  );

  if (title)
    return (
      <Tooltip content={title} trigger="focus">
        {btn}
      </Tooltip>
    );
  return btn;
};

Button.Variant = Variant;
