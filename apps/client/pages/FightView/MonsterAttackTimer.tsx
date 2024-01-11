import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import 'react-circular-progressbar/dist/styles.css';
import s from './FightView.module.scss';

type MonsterAttackTimerProps = { percentage: number };
export const MonsterAttackTimer = ({ percentage }: MonsterAttackTimerProps) => {
  return (
    <div className={s.fightView__timer}>
      <CircularProgressbar
        value={percentage}
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
