import { useEffect, useState } from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { MonsterMarker, ResourceMarker } from '@mhgo/types';
import {
  Button,
  Input,
  Select,
  modifiers,
  useAdminAllMonsterMarkersApi,
  useAdminDeleteMonsterMarkerApi,
  useAdminUpdateMonsterMarkerApi,
  useMonstersApi,
} from '@mhgo/front';
import { ActionBar } from '../../../containers';

import s from './SingleMarkerView.module.scss';
import { Status } from '../../../utils/types';
import { DEFAULT_MONSTER_MARKER } from '../../../utils/defaults';

type MarkerProps = {
  selectedMarker: string;
  setSelectedMarker: (selectedMarker: string | null) => void;
  selectedCoords: number[];
  onCancel: () => void;
  setStatus: (status: Status) => void;
};
export const MarkerEditView = ({
  selectedMarker,
  setSelectedMarker,
  selectedCoords,
  onCancel,
  setStatus,
}: MarkerProps) => {
  const { monsters, monsterMarker, setMonsterMarker, onSave, onDelete } =
    useUpdateMonsterMarker(
      selectedMarker,
      setSelectedMarker,
      selectedCoords,
      setStatus,
    );

  return (
    <div className={s.markerView__content}>
      <div
        className={s.markerView__content}
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
        }}>
        <div className={s.markerView__section}>
          <Input
            name="marker_lat"
            label="Latitude"
            value={String(monsterMarker?.coords[0])}
            setValue={newLat =>
              setMonsterMarker({
                ...monsterMarker,
                coords: [Number(newLat), monsterMarker.coords[1]],
              })
            }
          />
          <Input
            name="marker_lng"
            label="Longitude"
            value={String(monsterMarker?.coords[1])}
            setValue={newLong =>
              setMonsterMarker({
                ...monsterMarker,
                coords: [monsterMarker.coords[0], Number(newLong)],
              })
            }
          />
        </div>
        <div className={s.markerView__section}>
          <Select
            // If this is not present, the select will never update
            // upon switching the selected monster markers
            // Ugly hack but works lol
            key={new Date().valueOf().toString()}
            name="monster_marker"
            label="Monster on marker"
            data={monsters.map(m => ({ id: m.id, name: m.name }))}
            defaultSelected={monsterMarker?.monsterId}
            setValue={monsterId =>
              setMonsterMarker({
                ...monsterMarker,
                monsterId,
              })
            }
          />
        </div>
        <div className={s.markerView__section}>
          <FormControlLabel
            label="Random level?"
            control={
              <Switch
                color="default"
                checked={!monsterMarker?.level}
                onChange={(_, checked) =>
                  setMonsterMarker({
                    ...monsterMarker,
                    level: checked ? null : 1,
                  })
                }
              />
            }
          />
          {monsterMarker?.level !== null ? (
            <div
              className={modifiers(s, 'markerView__section', {
                hidden: true,
              })}>
              <Input
                name="marker_level"
                label="Monster level"
                min={0}
                type="number"
                value={String(monsterMarker?.level)}
                setValue={newLevel =>
                  setMonsterMarker({
                    ...monsterMarker,
                    level: newLevel === null ? null : Number(newLevel),
                  })
                }
              />
            </div>
          ) : null}
        </div>
      </div>
      <ActionBar
        buttons={
          <>
            <Button
              label="Cancel"
              inverted
              simple
              variant={Button.Variant.GHOST}
              onClick={onCancel}
            />
            <Button
              label="Delete"
              variant={Button.Variant.DANGER}
              onClick={onDelete}
            />
            <Button label="Save" onClick={onSave} />
          </>
        }
      />
    </div>
  );
};

type MonsterMarkerFixed = Omit<MonsterMarker, 'id' | 'respawnTime'>;
type ResourceMarkerFixed = Omit<ResourceMarker, 'id' | 'respawnTime'>;

// selectedMarker is in fact ObjectId from MongoDB
const useUpdateMonsterMarker = (
  selectedMarker: string,
  setSelectedMarker: (selectedMarker: string | null) => void,
  selectedCoords: number[],
  setStatus: (status: Status) => void,
) => {
  const { data: monsters } = useMonstersApi();
  const { data: monsterMarkers, isFetched: isMonstersFetched } =
    useAdminAllMonsterMarkersApi();

  const [monsterMarker, setMonsterMarker] = useState<MonsterMarkerFixed>(
    monsterMarkers.find(
      // @ts-expect-error it DOES have _id
      m => String(m._id) === selectedMarker,
    ) ?? DEFAULT_MONSTER_MARKER,
  );

  useEffect(() => {
    if (!monsterMarker) return;
    const coordsChanged =
      JSON.stringify(monsterMarker.coords) !== JSON.stringify(selectedCoords);
    if (!coordsChanged) return;

    setMonsterMarker({
      ...monsterMarker,
      coords: selectedCoords,
    });
  }, [selectedCoords]);

  useEffect(() => {
    const marker = monsterMarkers.find(
      // @ts-expect-error it DOES have _id
      m => String(m._id) === selectedMarker,
    );
    if (marker) setMonsterMarker(marker);
  }, [selectedMarker, isMonstersFetched]);

  const {
    mutate: mutateUpdate,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    isPending: isUpdatePending,
  } = useAdminUpdateMonsterMarkerApi();
  const {
    mutate: mutateDelete,
    isSuccess: isDeleteSuccess,
    isError: isDeleteError,
    isPending: isDeletePending,
  } = useAdminDeleteMonsterMarkerApi();

  useEffect(() => {
    setStatus({
      isSuccess: isDeleteSuccess,
      isError: isDeleteError,
      isPending: isDeletePending,
    });
  }, [isDeleteSuccess, isDeletePending, isDeleteError]);

  useEffect(() => {
    setStatus({
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      isPending: isUpdatePending,
    });
  }, [isUpdateSuccess, isUpdatePending, isUpdateError]);

  const onSave = () => {
    if (monsterMarker) {
      mutateUpdate({
        ...monsterMarker,
        id: String(selectedMarker),
      });
      setSelectedMarker(null);
    }
  };

  const onDelete = () => {
    if (selectedMarker) {
      mutateDelete({ markerId: selectedMarker });
      setSelectedMarker(null);
    }
  };

  return {
    monsters,
    monsterMarker,
    setMonsterMarker,
    onSave,
    onDelete,
  };
};
