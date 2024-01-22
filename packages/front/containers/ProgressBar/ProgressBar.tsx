import { modifiers } from '../..';
import s from './ProgressBar.module.scss';

type ProgressBarProps = {
  max: number;
  current: number;
  type?: string;
  tip?: string;
};
export const ProgressBar = ({ max, current, type }: ProgressBarProps) => {
  return (
    <div className={modifiers(s, 'progressBar', type)}>
      <div className={modifiers(s, 'progressBar__text', type)}>
        {current} / {max}
      </div>
      <div
        className={modifiers(s, 'progressBar__fg', { type })}
        style={{ width: `${(100 * current) / max}%` }}
      />
      <div className={modifiers(s, 'progressBar__bg', { type })} />
    </div>
  );
};

export const LoadingBar = ({
  max,
  current,
  type,
  tip = 'Loading assets...',
}: ProgressBarProps) => {
  const percentage = ((100 * current) / max).toFixed(2);

  return (
    <>
      <div className={modifiers(s, 'loadingBar', type)}>
        <div
          className={modifiers(s, 'loadingBar__fg', { type })}
          style={{ width: `${percentage}%` }}
        />
        <div className={modifiers(s, 'loadingBar__bg', { type })} />
        <div className={modifiers(s, 'progressBar__text', type)}>
          {percentage}%
        </div>
      </div>
      <div className={modifiers(s, 'loadingBar__text', type)}>{tip}</div>
    </>
  );
};
