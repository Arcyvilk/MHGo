import React from 'react';
import icons, { IconType as AssetIconType } from '../../assets/icons';

import s from './Icon.module.scss';
import { modifiers } from '../../utils/modifiers';
import { Size } from '../../utils/size';

type Props = {
  className?: string;
  spin?: boolean;
  icon: AssetIconType;
  size?: Size | number;
} & Omit<React.CSSProperties, 'width' | 'height'>;

export const Icon = (props: Props): JSX.Element => {
  const { spin = false, size = Size.SMALL, icon } = props;
  const SVG = icons[icon];

  return (
    <span className={modifiers(s, 'icon', String(size))}>
      <SVG className={modifiers(s, 'icon__svg', { spin })} />
    </span>
  );
};

export type IconType = AssetIconType;
