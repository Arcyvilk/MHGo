import { QueryBoundary, Select, Skeleton, useAdventuresApi } from '@mhgo/front';
import s from './AdventureSelect.module.scss';

type AdventureSelectProps = {
  currentAdventure: { id: string };
  onAdventureSwitch: (id: string) => void;
};
export const AdventureSelect = (props: AdventureSelectProps) => (
  <QueryBoundary fallback={<Skeleton />}>
    <Load {...props} />
  </QueryBoundary>
);

export const Load = ({
  currentAdventure,
  onAdventureSwitch,
}: AdventureSelectProps) => {
  const { data: adventures } = useAdventuresApi();

  const onSwitch = (id: string) => {
    onAdventureSwitch(id);
    location.reload();
  };

  const options = adventures.map(adventure => ({
    id: adventure.id,
    name: adventure.name,
    disabled: !adventure.enabled,
  }));

  return (
    <div className={s.adventureSelect}>
      <Select
        name="adventure_select"
        label="Current adventure"
        data={options}
        defaultSelected={currentAdventure.id}
        setValue={onSwitch}
      />
    </div>
  );
};
