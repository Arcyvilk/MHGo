import { useState } from 'react';
import { useInterval } from '@mhgo/front';

import s from './FightView.module.scss';

export type DmgValue = { timestamp: number; dmg: number };

type PlayerDPSProps = {
  dmgValues: DmgValue[];
};
export const PlayerDPS = ({ dmgValues }: PlayerDPSProps) => {
  const [dps, setDps] = useState(0);

  useInterval(() => {
    const currTimestamp = Date.now();
    const fullDamage = dmgValues.reduce((acc, curr) => {
      if (curr.timestamp >= currTimestamp - 3000) {
        return acc + curr.dmg;
      } else return acc;
    }, 0);
    const newDps = Math.round(fullDamage / 3);
    setDps(newDps);
  }, 1000);

  return <div className={s.fightView__dps}>DPS: {dps}</div>;
};
