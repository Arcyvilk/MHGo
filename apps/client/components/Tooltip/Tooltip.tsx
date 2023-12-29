import React from 'react';
import Tippy from '@tippyjs/react/headless';

import s from './Tooltip.module.scss';

type TooltipProps = {
  children: React.ReactElement;
  content: React.ReactNode;
  trigger?: string;
};
export const Tooltip = ({ children, content, trigger }: TooltipProps) => {
  return (
    <Tippy
      trigger={trigger ?? 'click'}
      render={attrs => (
        <div className={s.tooltip} {...attrs}>
          {content}
        </div>
      )}>
      <span tabIndex={0} className={s.tooltip__wrapper}>
        {children}
      </span>
    </Tippy>
  );
};
