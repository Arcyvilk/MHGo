import { Icon } from '..';
import { modifiers } from '../..';

import s from './Loader.module.scss';

type Props = { fullScreen?: boolean; noPadding?: boolean };
export const Loader = ({ fullScreen = false, noPadding = false }: Props) => {
  return (
    <div className={modifiers(s, 'loader', { fullScreen, noPadding })}>
      <Icon icon="Spin" spin />
    </div>
  );
};
