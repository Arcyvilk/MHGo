import { useUserStatsApi } from '../../api';
import { Icon, Loader, QueryBoundary } from '../../components';
import { useUser } from '../../hooks/useUser';
import { Size } from '../../utils/size';

import s from './EquipmentOverview.module.scss';

export const EquipmentOverview = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const { userId } = useUser();
  const { data: userStats } = useUserStatsApi(userId);

  return (
    <div className={s.equipmentView__overview}>
      <div className={s.equipmentView__stats}>
        <div className={s.stats}>
          <span>
            <Icon icon="Sword" size={Size.MICRO} />
            Attack
          </span>
          <span>{userStats?.attack ?? '?'}</span>
        </div>
        <div className={s.stats}>
          <span>
            <Icon icon="Fire" size={Size.MICRO} />
            Element
          </span>
          <span>{userStats?.element ?? '?'}</span>
        </div>
        <div className={s.stats}>
          <span>
            <Icon icon="Shield" size={Size.MICRO} />
            Defense
          </span>
          <span>{userStats?.defense ?? '?'}</span>
        </div>
        <div className={s.stats}>
          <span>
            <Icon icon="Pulse" size={Size.MICRO} />
            HP
          </span>
          <span>{userStats?.health ?? '?'}</span>
        </div>
        <div className={s.stats}>
          <span>
            <Icon icon="Burst" size={Size.MICRO} />
            Crit chance
          </span>
          <span>{userStats?.critChance ?? '?'}</span>
        </div>
      </div>
    </div>
  );
};
