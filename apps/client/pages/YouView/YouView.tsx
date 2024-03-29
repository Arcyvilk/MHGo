import { CloseButton } from '@mhgo/front';
import { Buttons } from './Buttons';
import { Experience } from './Experience';
import { Hunter } from './Hunter';

import s from './YouView.module.scss';

export const YouView = () => {
  return (
    <div className={s.youView}>
      <div className={s.header}>
        <h1 className={s.header__title}>Hoarder</h1>
        <Experience />
      </div>
      <div className={s.youView__wrapper}>
        <Hunter />
        <Buttons />
      </div>
      <CloseButton />
    </div>
  );
};
