import React from 'react';
import Tippy from '@tippyjs/react/headless';

import s from './Dropdown.module.scss';

type DropdownProps = {
  children: React.ReactElement;
  content: React.ReactNode;
};
export const Dropdown = ({ children, content }: DropdownProps) => {
  return (
    <Tippy
      trigger="click"
      interactive
      render={attrs => (
        <div className={s.dropdown} {...attrs}>
          {content}
        </div>
      )}>
      <span tabIndex={0}>{children}</span>
    </Tippy>
  );
};
