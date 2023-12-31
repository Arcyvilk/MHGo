import { useUserHealthApi, useUserStatsApi } from '../../api';
import { Icon, Loader, QueryBoundary, Tooltip } from '@mhgo/components';
import { HealthBarSimple } from '../../containers';
import { useUser } from '../../hooks/useUser';
import { Size } from '@mhgo/components';

import s from './EquipmentOverview.module.scss';

export const EquipmentOverview = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const { userId } = useUser();
  const { data: userStats } = useUserStatsApi(userId);
  const { data: userHealth } = useUserHealthApi(userId);

  return (
    <div className={s.equipmentView__overview}>
      <div className={s.equipmentView__stats}>
        <div className={s.stats}>
          <Tooltip content="How much raw damage you deal per hit">
            <>
              <Icon icon="Sword" size={Size.MICRO} />
              Attack
            </>
          </Tooltip>
          <span>{userStats?.attack ?? '?'}</span>
        </div>
        <div className={s.stats}>
          <Tooltip content="Your current dominant element, infusing your attacks with additional elemental damage">
            <>
              <Icon icon="Fire" size={Size.MICRO} />
              Element
            </>
          </Tooltip>
          <span>{userStats?.element ?? '?'}</span>
        </div>
        <div className={s.stats}>
          <Tooltip content="Physical damage dealt to you will be mitigated according to a formula: damage * 100 / (100 + defense)">
            <>
              <Icon icon="Shield" size={Size.MICRO} />
              Defense
            </>
          </Tooltip>
          <span>{userStats?.defense ?? '?'}</span>
        </div>
        <div className={s.stats}>
          <Tooltip content="Your maximum HP">
            <span>
              <Icon icon="Pulse" size={Size.MICRO} />
              HP
            </span>
          </Tooltip>
          <span>{userStats?.health ?? '?'}</span>
        </div>
        <div className={s.stats}>
          <Tooltip content="Percentage chance of dealing double physical damage">
            <span>
              <Icon icon="Burst" size={Size.MICRO} />
              Crit chance
            </span>
          </Tooltip>
          <span>{userStats?.critChance ?? '?'}%</span>
        </div>
      </div>
      <HealthBarSimple
        maxHP={userHealth.maxHealth}
        currentHP={userHealth.currentHealth}
      />
    </div>
  );
};
