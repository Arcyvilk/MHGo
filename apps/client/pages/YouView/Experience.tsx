import { Size } from '../../utils/size';
import { useUser } from '../../hooks/useUser';
import { Icon } from '../../components';

import s from './Experience.module.scss';

import { useSettingsApi } from '../../api';

export const Experience = () => {
  const { userExp } = useUser();
  const { setting: expPerLevel } = useSettingsApi<number>('exp_per_level', 0);

  return (
    <div className={s.experience}>
      <Icon icon="Paintball" size={Size.TINY} />
      <span className={s.experience__title}>HRP</span>
      <div className={s.experience__bar}>
        <div className={s.bar__text}>
          {userExp} / {expPerLevel}
        </div>
        <div
          className={s.bar__fg}
          style={{ width: `${(100 * userExp) / expPerLevel}%` }}
        />
        <div className={s.bar__bg} />
      </div>
    </div>
  );
};
