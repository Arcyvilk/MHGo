import s from './Slider.module.scss';

type SliderProps = React.InputHTMLAttributes<HTMLInputElement>;
export const Slider = (props: SliderProps) => {
  return (
    <div className={s.slider}>
      <input className={s.slider__range} type="range" {...props} />
    </div>
  );
};
