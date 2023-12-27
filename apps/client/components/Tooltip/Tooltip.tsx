import React from 'react';
import Tippy from '@tippyjs/react/headless';

import s from './Tooltip.module.scss';

type TooltipProps = {
  children: React.ReactElement;
  content: string;
};
export const Tooltip = ({ children, content }: TooltipProps) => {
  return (
    <Tippy
      trigger="click"
      render={attrs => (
        <div className={s.tooltip} {...attrs}>
          {content}
        </div>
      )}>
      <span tabIndex={0}>{children}</span>
    </Tippy>
  );
};
