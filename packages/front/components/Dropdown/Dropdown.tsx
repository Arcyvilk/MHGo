import React, { useState } from 'react';
import { Instance } from 'tippy.js';
import Tippy from '@tippyjs/react/headless';

import s from './Dropdown.module.scss';

type DropdownProps = {
  children: React.ReactElement;
  content: React.ReactNode;
  setInstance: (instance: Instance | null) => void;
};
export const Dropdown = ({ children, content, setInstance }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

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
      appendTo={document.body}
      zIndex={999}
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
