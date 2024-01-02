import { Icon, Size, Tooltip } from '@mhgo/front';

export const IconInfo = ({ tooltip }: { tooltip: React.ReactNode }) => {
  return (
    <Tooltip content={tooltip}>
      <Icon icon="Info" size={Size.MICRO} />
    </Tooltip>
  );
};
