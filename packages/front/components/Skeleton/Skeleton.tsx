import MUISkeleton from '@mui/material/Skeleton';
import { Size } from '../..';

type Props = {
  size?: Size;
  variant?: 'rounded' | 'text' | 'rectangular' | 'circular';
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
};

export const Skeleton = (props: Props) => {
  const {
    width,
    height,
    variant = 'rounded',
    style = {},
    size = Size.MEDIUM,
  } = props;

  return (
    <MUISkeleton
      // $color-header-bg
      sx={{ bgcolor: 'rgb(167, 155, 127)' }}
      variant={variant}
      width={width ?? `${size}rem`}
      height={height ?? `${size}rem`}
      style={style}
    />
  );
};
