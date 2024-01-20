import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import 'react-circular-progressbar/dist/styles.css';
import s from './FightView.module.scss';
import { useMonsterMarker } from '../../hooks/useMonsterMarker';
import { useState } from 'react';
import { useInterval, useUserStatsApi } from '@mhgo/front';
import { useUser } from '../../hooks/useUser';
import { ItemEffect } from '@mhgo/types';

type MonsterAttackTimerProps = {
  isFightFinished: boolean;
  getFearMultiplier: (fear: number) => number;
};
export const MonsterAttackTimer = ({
  isFightFinished,
  getFearMultiplier,
}: MonsterAttackTimerProps) => {
  const { userId } = useUser();
  const { data: userStats } = useUserStatsApi(userId);
  const { fear = 0 } = (userStats?.specialEffects ?? {}) as Record<
    ItemEffect,
    number
  >;

  const fearMultiplier = getFearMultiplier(fear);

  const { percentageToNextHit } = useMonsterAttackTimer(
    isFightFinished,
    fearMultiplier,
  );

  return (
    <div className={s.fightView__timer}>
      <CircularProgressbar
        value={percentageToNextHit}
        minValue={0}
        maxValue={100}
        strokeWidth={50}
        styles={buildStyles({
          strokeLinecap: 'butt',
          pathColor: 'rgb(255, 116, 73)',
          trailColor: 'rgba(0,0,0,0.3)',
          backgroundColor: 'transparent',
          pathTransitionDuration: 0,
        })}
      />
    </div>
  );
};

const useMonsterAttackTimer = (
  isFightFinished: boolean,
  fearMultiplier: number,
) => {
  const [percentageToNextHit, setPercentageToNextHit] = useState(0);
  const { monster } = useMonsterMarker();
  const { baseAttackSpeed } = monster;

  const FRAME_CADENCE = 40;

  useInterval(
    () => {
      const attackSpeed = baseAttackSpeed * fearMultiplier;
      const cooldownPerFrame = attackSpeed / FRAME_CADENCE;
      const newPercentage = percentageToNextHit + cooldownPerFrame * 100;

      if (newPercentage > 100) setPercentageToNextHit(newPercentage - 100);
      else setPercentageToNextHit(newPercentage);
    },
    isFightFinished ? null : 1000 / FRAME_CADENCE,
  );

  return { percentageToNextHit };
};
