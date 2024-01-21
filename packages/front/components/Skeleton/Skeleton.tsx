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
      // $color-bar
      sx={{ bgcolor: `rgb(84,98,118)` }}
      variant={variant}
      width={width ?? `${size}rem`}
      height={height ?? `${size}rem`}
      style={style}
    />
  );
};
