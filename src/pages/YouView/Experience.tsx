import { Icon } from '../../components/Icon';
import { Size } from '../../utils/size';
import { useUser } from '../../hooks/useUser';

import s from './Experience.module.scss';

import { EXP_PER_LEVEL } from '../../_mock/settings';

type ExperienceProps = { userId: string };
export const Experience = ({ userId }: ExperienceProps) => {
  const { userExp } = useUser(userId);

  return (
    <div className={s.experience}>
      <Icon icon="Paintball" size={Size.TINY} />
      <span className={s.experience__title}>HRP</span>
      <div className={s.experience__bar}>
        <div className={s.bar__text}>
          {userExp} / {EXP_PER_LEVEL}
        </div>
        <div
          className={s.bar__fg}
          style={{ width: `${(100 * userExp) / EXP_PER_LEVEL}%` }}
        />
        <div className={s.bar__bg} />
      </div>
    </div>
  );
};
