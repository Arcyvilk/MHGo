import React, { useState } from 'react';
import { Instance } from 'tippy.js';
import Tippy from '@tippyjs/react/headless';

import s from './Dropdown.module.scss';

type DropdownProps = {
  children: React.ReactElement;
  content: React.ReactNode;
  setInstance: (instance: Instance | null) => void;
  // This prevents Dropdown from closing even in situatoins when it technically should
  isSuspended: boolean;
};
export const Dropdown = ({
  children,
  content,
  setInstance,
  isSuspended,
}: DropdownProps) => {
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
        if (isSuspended) return;
        setInstance(null);
        setIsOpen(false);
      }}
      appendTo={document.body}
      className={s.dropdown__tippy}
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
