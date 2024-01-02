import { Icon, Size, Tooltip } from '@mhgo/front';

export const IconInfo = () => {
  return (
    <Tooltip content="Base value is multiplied by monster level">
      <Icon icon="Info" size={Size.MICRO} />
    </Tooltip>
  );
};
