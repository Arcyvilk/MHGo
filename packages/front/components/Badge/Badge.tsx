import { modifiers, Size } from '../../utils';
import { Icon, IconType } from '../Icon';
import s from './Badge.module.scss';

type BadgeProps = {
  variant?: Variant;
  label: string;
  icon?: IconType;
};
export const Badge = ({
  variant = Variant.DEFAULT,
  label,
  icon,
}: BadgeProps) => {
  return (
    <div className={modifiers(s, 'badge', variant)}>
      {icon && <Icon icon={icon} size={Size.MICRO} />}
      <span>{label}</span>
    </div>
  );
};

enum Variant {
  DEFAULT = 'default',
  DANGER = 'danger',
  ACTION = 'action',
  WARNING = 'warning',
}

Badge.Variant = Variant;
