import { useEffect, useState } from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { MapMarker, MonsterMarker, ResourceMarker } from '@mhgo/types';
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
import { ActionBar, IconInfo } from '../../../containers';
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

type MarkerProps = {
  selectedCoords: number[];
  onCancel: () => void;
  setStatus: (status: Status) => void;
};
export const MarkerCreateView = ({
  selectedCoords,
  onCancel,
  setStatus,
}: MarkerProps) => {
  const {
    markerType,
    setMarkerType,
    monsterMarker,
    setMonsterMarker,
    mapMarker,
    setMapMarker,
    resourceMarker,
    setResourceMarker,
    monsters,
    resources,
    onCreate,
  } = useUpdateMarker(selectedCoords, setStatus, onCancel);

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
            value={String(mapMarker?.coords[0])}
            setValue={newLat =>
              mapMarker &&
              setMapMarker({
                ...mapMarker,
                coords: [Number(newLat), mapMarker.coords[1]],
              })
            }
          />
          <Input
            name="marker_lng"
            label="Longitude"
            value={String(mapMarker?.coords[1])}
            setValue={newLong =>
              mapMarker &&
              setMapMarker({
                ...mapMarker,
                coords: [mapMarker.coords[0], Number(newLong)],
              })
            }
          />
          <div className={s.markerView__section}>
            <FormControlLabel
              label="Custom respawn time"
              control={
                <Switch
                  color="default"
                  checked={Boolean(mapMarker?.respawnTime)}
                  onChange={(_, checked) =>
                    mapMarker &&
                    setMapMarker({
                      ...mapMarker,
                      respawnTime: checked ? 300 : 0,
                    })
                  }
                />
              }
            />
            {mapMarker?.respawnTime ? (
              <div
                className={modifiers(s, 'markerView__section', {
                  hidden: true,
                })}>
                <Input
                  name="respawn_time"
                  label={
                    <div className={s.markerView__infoIcon}>
                      <IconInfo tooltip="If not set, will use the default respawn time for this type of marker which you can change in Settings page." />
                      Respawn time
                    </div>
                  }
                  value={String(mapMarker?.respawnTime)}
                  setValue={respawnTime =>
                    mapMarker &&
                    setMapMarker({
                      ...mapMarker,
                      respawnTime: Number(respawnTime),
                    })
                  }
                />
              </div>
            ) : null}
          </div>
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

type MapMarkerFixed = Omit<MapMarker, 'id'>;
type MonsterMarkerFixed = Omit<MonsterMarker, 'id'>;
type ResourceMarkerFixed = Omit<ResourceMarker, 'id'>;

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
  const [mapMarker, setMapMarker] = useState<MapMarkerFixed>();

  const { mutateMarkerMonster, mutateResourceMarker } = useStatus(setStatus);

  const { data: monsters } = useMonstersApi();
  const { data: resources } = useResourcesApi();

  useEffect(() => {
    const coordsChanged =
      JSON.stringify(mapMarker?.coords) !== JSON.stringify(selectedCoords);
    if (coordsChanged) setMapMarker({ ...mapMarker, coords: selectedCoords });
  }, [selectedCoords]);

  const onCreate = () => {
    if (markerType === MarkerType.MONSTER && monsterMarker && mapMarker) {
      mutateMarkerMonster({
        ...monsterMarker,
        ...mapMarker,
        respawnTime: mapMarker.respawnTime ?? undefined,
      });
      onCancel();
    }
    if (markerType === MarkerType.RESOURCE && resourceMarker && mapMarker) {
      mutateResourceMarker({
        ...resourceMarker,
        ...mapMarker,
        respawnTime: mapMarker.respawnTime ?? undefined,
      });
      onCancel();
    }
  };

  return {
    markerType,
    setMarkerType,
    monsterMarker,
    setMonsterMarker,
    resourceMarker,
    setResourceMarker,
    mapMarker,
    setMapMarker,
    monsters,
    resources,
    onCreate,
  };
};

const useStatus = (setStatus: (status: Status) => void) => {
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

  return { mutateMarkerMonster, mutateResourceMarker };
};
