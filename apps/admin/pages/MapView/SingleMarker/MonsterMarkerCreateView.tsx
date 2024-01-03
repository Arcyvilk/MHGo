import { useEffect, useState } from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { MonsterMarker, ResourceMarker } from '@mhgo/types';
import {
  Button,
  Input,
  Select,
  modifiers,
  useAdminCreateMonsterMarkerApi,
  useAdminCreateResourceMarkerApi,
  useMonstersApi,
  useResourcesApi,
} from '@mhgo/front';
import { ActionBar } from '../../../containers';
import { Status } from '../../../utils/types';

import s from './SingleMarkerView.module.scss';
import {
  DEFAULT_MONSTER_MARKER,
  DEFAULT_RESOURCE_MARKER,
} from '../../../utils/defaults';

enum MarkerType {
  RESOURCE = 'resource',
  MONSTER = 'monster',
}

type MonsterMarkerProps = {
  selectedCoords: number[];
  onCancel: () => void;
  setStatus: (status: Status) => void;
};
export const MonsterMarkerCreateView = ({
  selectedCoords,
  onCancel,
  setStatus,
}: MonsterMarkerProps) => {
  const {
    markerType,
    setMarkerType,
    monsterMarker,
    setMonsterMarker,
    resourceMarker,
    setResourceMarker,
    updateCoords,
    updatedCoords,
    monsters,
    resources,
    onCreate,
  } = useUpdateMarker(selectedCoords, setStatus, onCancel);

  const lat = updatedCoords[0];
  const lng = updatedCoords[1];

  return (
    <div className={s.markerView__content}>
      <div
        className={s.markerView__content}
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '8px',
        }}>
        <div className={s.markerView__section}>
          <Input
            name="marker_lat"
            label="Latitude"
            value={String(lat)}
            setValue={newLat => updateCoords('lat', Number(newLat))}
          />
          <Input
            name="marker_lng"
            label="Longitude"
            value={String(lng)}
            setValue={newLng => updateCoords('lng', Number(newLng))}
          />
        </div>
        <div className={s.markerView__section}>
          <div className={s.markerView__switch}>
            <span>Resource</span>
            <Switch
              defaultChecked
              size="small"
              color="default"
              onChange={(_, checked) => {
                if (checked) setMarkerType(MarkerType.MONSTER);
                else setMarkerType(MarkerType.RESOURCE);
              }}
            />
            <span>Monster</span>
          </div>
        </div>
        {/* 
          MARKER TYPE - MONSTER
        */}
        {markerType === MarkerType.MONSTER && (
          <div
            className={modifiers(s, 'markerView__section', { hidden: true })}>
            <Select
              name="monster_marker"
              label="Monster on marker"
              data={monsters.map(m => ({ id: m.id, name: m.name }))}
              defaultSelected={monsterMarker?.monsterId ?? monsters[0].id}
              setValue={monsterId =>
                setMonsterMarker({
                  ...monsterMarker,
                  monsterId,
                })
              }
            />
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
              <Input
                name="marker_level"
                label="Monster level"
                value={String(monsterMarker?.level)}
                setValue={newLevel =>
                  setMonsterMarker({
                    ...monsterMarker,
                    level: newLevel === null ? null : Number(newLevel),
                  })
                }
              />
            ) : null}
          </div>
        )}
        {/* 
          MARKER TYPE - RESOURCE
        */}
        {markerType === MarkerType.RESOURCE && (
          <div
            className={modifiers(s, 'markerView__section', { hidden: true })}>
            <Select
              name="resource_marker"
              label="Resource on marker"
              data={resources.map(m => ({ id: m.id, name: m.name }))}
              defaultSelected={resourceMarker?.resourceId ?? resources[0].id}
              setValue={resourceId =>
                setResourceMarker({
                  ...resourceMarker,
                  resourceId,
                })
              }
            />
          </div>
        )}
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
            <Button label="Save" onClick={onCreate} />
          </>
        }
      />
    </div>
  );
};

type MonsterMarkerFixed = Omit<MonsterMarker, 'id' | 'respawnTime' | 'coords'>;
type ResourceMarkerFixed = Omit<
  ResourceMarker,
  'id' | 'respawnTime' | 'coords'
>;

const useUpdateMarker = (
  selectedCoords: number[],
  setStatus: (status: Status) => void,
  onCancel: () => void,
) => {
  const [markerType, setMarkerType] = useState(MarkerType.MONSTER);
  const [monsterMarker, setMonsterMarker] = useState<MonsterMarkerFixed>(
    DEFAULT_MONSTER_MARKER,
  );
  const [resourceMarker, setResourceMarker] = useState<ResourceMarkerFixed>(
    DEFAULT_RESOURCE_MARKER,
  );

  const { data: monsters } = useMonstersApi();
  const { data: resources } = useResourcesApi();

  const [updatedCoords, setUpdatedCoords] = useState(selectedCoords);

  useEffect(() => {
    const coordsChanged =
      JSON.stringify(updatedCoords) !== JSON.stringify(selectedCoords);
    if (coordsChanged) setUpdatedCoords(selectedCoords);
  }, [selectedCoords]);

  const {
    mutate: mutateMarkerMonster,
    isSuccess: isSuccessMonster,
    isError: isErrorMonster,
    isPending: isPendingMonster,
  } = useAdminCreateMonsterMarkerApi();
  const {
    mutate: mutateResourceMarker,
    isSuccess: isSuccessResource,
    isError: isErrorResource,
    isPending: isPendingResource,
  } = useAdminCreateResourceMarkerApi();

  useEffect(() => {
    setStatus({
      isSuccess: isSuccessMonster,
      isError: isErrorMonster,
      isPending: isPendingMonster,
    });
  }, [isSuccessMonster, isErrorMonster, isPendingMonster]);

  useEffect(() => {
    setStatus({
      isSuccess: isSuccessResource,
      isError: isErrorResource,
      isPending: isPendingResource,
    });
  }, [isSuccessResource, isErrorResource, isPendingResource]);

  const onCreate = () => {
    if (markerType === MarkerType.MONSTER) {
      mutateMarkerMonster({ ...monsterMarker, coords: updatedCoords });
      onCancel();
    }
    if (markerType === MarkerType.RESOURCE) {
      mutateResourceMarker({ ...resourceMarker, coords: updatedCoords });
      onCancel();
    }
  };

  const updateCoords = (type: 'lat' | 'lng', value: number) => {
    setUpdatedCoords([
      type === 'lat' ? value : updatedCoords[0],
      type === 'lng' ? value : updatedCoords[1],
    ]);
  };

  return {
    markerType,
    setMarkerType,
    monsterMarker,
    setMonsterMarker,
    resourceMarker,
    setResourceMarker,
    updateCoords,
    updatedCoords,
    setUpdatedCoords,
    monsters,
    resources,
    onCreate,
  };
};
