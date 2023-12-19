import { Icon } from '../../components/Icon';
import { Size } from '../../utils/size';

import s from './Experience.module.scss';

export const Experience = () => {
  return (
    <div className={s.experience}>
      <Icon icon="Ball" size={Size.SMALL} />
      <span className={s.experience__title}>HRP</span>
      <div className={s.experience__bar}>
        <div className={s.bar__text}>0 / 100</div>
        <div className={s.bar__fg} />
        <div className={s.bar__bg} />
      </div>
    </div>
  );
};
