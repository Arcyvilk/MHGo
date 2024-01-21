import { Icon } from '..';
import { modifiers } from '../..';

import s from './Loader.module.scss';

type Props = { fullScreen?: boolean };
export const Loader = ({ fullScreen = false }: Props) => {
  return (
    <div className={modifiers(s, 'loader', { fullScreen })}>
      <Icon icon="Spin" spin />
    </div>
  );
};
