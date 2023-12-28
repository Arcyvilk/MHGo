import { useEffect, useState } from 'react';
import { modifiers } from '../../../utils/modifiers';
import s from './Flash.module.scss';

type FlashProps = {
  type: 'green' | 'red';
  isActivated: boolean;
};
export const Flash = ({ type, isActivated }: FlashProps) => {
  const [isActive, setIsActive] = useState(isActivated);

  useEffect(() => {
    setIsActive(isActivated);
  }, [isActivated]);

  useEffect(() => {
    if (isActive) {
      setTimeout(() => {
        setIsActive(false);
      }, 1000);
    }
  }, [isActive]);

  if (isActive) return <div className={modifiers(s, 'flash', type)} />;
  return null;
};
