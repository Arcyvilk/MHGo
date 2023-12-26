import s from './QueryBoundary.module.scss';

type Props = {
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  error?: string;
};
export const ErrorFallback = (props: Props) => {
  const { error = 'Could not load', ...rest } = props;

  return (
    <div className={s.errorFallback} {...rest}>
      <img
        className={s.errorFallback_img}
        src="https://cdn.masochist.me/files/ash_fail.png"
      />
      <div className={s.errorFallback_text}>{error}</div>
    </div>
  );
};
