import React, { useState } from 'react';
import Tippy from '@tippyjs/react/headless';

import s from './Dropdown.module.scss';

type DropdownProps = {
  children: React.ReactElement;
  content: React.ReactNode;
};
export const Dropdown = ({ children, content }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [instance, setInstance] = useState<unknown>(null);

  return (
    <Tippy
      trigger="click"
      interactive
      hideOnClick
      onShow={tippyInstance => {
        setIsOpen(true);
        setInstance(tippyInstance);
      }}
      onHide={() => {
        setInstance(null);
        setIsOpen(false);
      }}
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
