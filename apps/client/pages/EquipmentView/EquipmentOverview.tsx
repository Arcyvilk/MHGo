import { useState } from 'react';
import {
  Icon,
  Loader,
  QueryBoundary,
  Tooltip,
  Size,
  useUserHealthApi,
  useUserStatsApi,
  Button,
} from '@mhgo/front';
import { HealthBarSimple, ModalUserStats } from '../../containers';
import { useUser } from '../../hooks/useUser';

import s from './EquipmentOverview.module.scss';

export const EquipmentOverview = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const { userId } = useUser();
  const { data: userStats, isFetched } = useUserStatsApi(userId);
  const { data: userHealth } = useUserHealthApi(userId);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onStatsModalOpen = () => {
    setIsModalOpen(true);
  };

  return (
    <div className={s.equipmentView__overview}>
      {isFetched && userStats && (
        <ModalUserStats
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          userStats={userStats}
        />
      )}
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
              <Icon icon="Dice" size={Size.MICRO} />
              Crit chance
            </span>
          </Tooltip>
          <span>{userStats?.critChance ?? '?'}%</span>
        </div>
        <div className={s.stats}>
          <Tooltip content="Additional damage dealt by critical hits">
            <span>
              <Icon icon="Burst" size={Size.MICRO} />
              Crit damage
            </span>
          </Tooltip>
          <span>{userStats?.critDamage ?? '?'}%</span>
        </div>
        <div className={s.stats}>
          <Tooltip content="Percentage chance of dropping additional reward from monsters">
            <span>
              <Icon icon="Luck" size={Size.MICRO} />
              Luck
            </span>
          </Tooltip>
          <span>{userStats?.luck ?? '?'}%</span>
        </div>
        <div className={s.stats} style={{ marginTop: '16px' }}>
          <Button label="See more" onClick={onStatsModalOpen} small />
        </div>
      </div>
      <HealthBarSimple
        maxHP={userHealth.maxHealth}
        currentHP={userHealth.roundCurrentHealth}
      />
    </div>
  );
};
