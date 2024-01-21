import { Icon } from '..';
import { modifiers } from '../..';

import s from './Loader.module.scss';

type Props = { fullScreen?: boolean; withPadding?: boolean };
export const Loader = ({ fullScreen = false, withPadding = false }: Props) => {
  return (
    <div className={modifiers(s, 'loader', { fullScreen, withPadding })}>
      <Icon icon="Spin" spin />
    </div>
  );
};
