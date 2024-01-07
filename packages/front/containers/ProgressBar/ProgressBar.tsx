import { modifiers } from '../..';
import s from './ProgressBar.module.scss';

type ProgressBarProps = { max: number; current: number; type?: string };
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
