import React, { useState } from 'react';
import Tippy from '@tippyjs/react/headless';

import s from './Dropdown.module.scss';

type DropdownProps = {
  children: React.ReactElement;
  content: React.ReactNode;
};
export const Dropdown = ({ children, content }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Tippy
      trigger="click"
      interactive
      onShow={() => setIsOpen(true)}
      onHide={() => setIsOpen(false)}
      render={attrs => (
        <div className={s.dropdown} {...attrs}>
          {isOpen ? content : null}
        </div>
      )}>
      <span tabIndex={0} style={{ all: 'inherit' }}>
        {children}
      </span>
    </Tippy>
  );
};
