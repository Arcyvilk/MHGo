import React from 'react';
import { Icon } from '..';

import s from './Loader.module.scss';

type Props = { title?: React.ReactNode };
export const Loader = ({ title }: Props) => {
  return (
    <div className={s.loader}>
      <Icon icon="Spin" spin />
      {title && <div>{title}</div>}
    </div>
  );
};
