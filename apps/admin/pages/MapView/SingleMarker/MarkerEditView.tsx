import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { FormControlLabel, Switch } from '@mui/material';
import { MapMarker, MonsterMarker, ResourceMarker } from '@mhgo/types';
import {
  Button,
  Input,
  Loader,
  QueryBoundary,
  Select,
  modifiers,
  useAdminAllMonsterMarkersApi,
  useAdminDeleteMonsterMarkerApi,
  useAdminDeleteResourceMarkerApi,
  useAdminUpdateMonsterMarkerApi,
  useAdminUpdateResourceMarkerApi,
  useAllResourceMarkersApi,
  useMonstersApi,
  useResourcesApi,
} from '@mhgo/front';
import { ActionBar, IconInfo } from '../../../containers';

import s from './SingleMarkerView.module.scss';
import { Status } from '../../../utils/types';
import {
  DEFAULT_MONSTER_MARKER,
  DEFAULT_RESOURCE_MARKER,
} from '../../../utils/defaults';

enum MarkerType {
  RESOURCE = 'resource',
  MONSTER = 'monster',
}

type MarkerProps = {
  selectedMarker: string;
  setSelectedMarker: (selectedMarker: string | null) => void;
  selectedCoords: number[];
  setSelectedCoords: (selectedCoords: number[]) => void;
  onCancel: () => void;
  setStatus: (status: Status) => void;
};
export const MarkerEditView = (props: MarkerProps) => (
  <QueryBoundary fallback={<Loader withPadding />}>
    <Load {...props} />
  </QueryBoundary>
);

const Load = ({
  selectedMarker,
  setSelectedMarker,
  selectedCoords,
  setSelectedCoords,
  onCancel,
  setStatus,
}: MarkerProps) => {
  const {
    markerType,
    monsters,
    monsterMarker,
    setMonsterMarker,
    mapMarker,
    setMapMarker,
    resources,
    resourceMarker,
    setResourceMarker,
    onSave,
    onDelete,
  } = useUpdateMonsterMarker(
    selectedMarker,
    setSelectedMarker,
    selectedCoords,
    setSelectedCoords,
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
        {markerType === MarkerType.RESOURCE && (
          <div className={s.markerView__section}>
            <Select
              // If this is not present, the select will never update
              // upon switching the selected monster markers
              // Ugly hack but works lol
              key={uuid()}
              name="resource_marker"
              label="Resource on marker"
              data={resources.map(r => ({ id: r.id, name: r.name }))}
              defaultSelected={resourceMarker?.resourceId}
              setValue={resourceId =>
                setResourceMarker({
                  ...resourceMarker,
                  resourceId,
                })
              }
            />
          </div>
        )}
        {markerType === MarkerType.MONSTER && (
          <div className={s.markerView__section}>
            <Select
              // If this is not present, the select will never update
              // upon switching the selected monster markers
              // Ugly hack but works lol
              key={uuid()}
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

type MapMarkerFixed = Omit<MapMarker, 'id'>;
type MonsterMarkerFixed = Omit<MonsterMarker, 'id'>;
type ResourceMarkerFixed = Omit<ResourceMarker, 'id'>;

// selectedMarker is in fact ObjectId from MongoDB
const useUpdateMonsterMarker = (
  selectedMarker: string,
  setSelectedMarker: (selectedMarker: string | null) => void,
  selectedCoords: number[],
  setSelectedCoords: (selectedCoords: number[]) => void,
  setStatus: (status: Status) => void,
) => {
  const [markerType, setMarkerType] = useState(MarkerType.MONSTER);
  const { data: monsters } = useMonstersApi();
  const { data: resources } = useResourcesApi();
  const { data: monsterMarkers, isFetched: isMonstersFetched } =
    useAdminAllMonsterMarkersApi();
  const { data: resourceMarkers, isFetched: isResourcesFetched } =
    useAllResourceMarkersApi();

  const {
    mutateUpdateMonsterMarker,
    mutateDeleteMonsterMarker,
    mutateUpdateResourceMarker,
    mutateDeleteResourceMarker,
  } = useStatus(setStatus);

  const [monsterMarker, setMonsterMarker] = useState<MonsterMarkerFixed>(
    monsterMarkers.find(
      // @ts-expect-error it DOES have _id
      m => String(m._id) === selectedMarker,
    ) ?? DEFAULT_MONSTER_MARKER,
  );
  const [resourceMarker, setResourceMarker] = useState<ResourceMarkerFixed>(
    resourceMarkers.find(
      // @ts-expect-error it DOES have _id
      m => String(m._id) === selectedMarker,
    ) ?? DEFAULT_RESOURCE_MARKER,
  );
  const [mapMarker, setMapMarker] = useState<MapMarkerFixed>();

  useEffect(() => {
    const marker = monsterMarkers.find(
      // @ts-expect-error it DOES have _id
      m => String(m._id) === selectedMarker,
    );
    if (marker) {
      setMonsterMarker(marker);
      setMarkerType(MarkerType.MONSTER);
      setMapMarker({ coords: marker.coords, respawnTime: marker.respawnTime });
      setSelectedCoords(marker.coords);
    }
  }, [selectedMarker, isMonstersFetched]);

  useEffect(() => {
    const marker = resourceMarkers.find(
      // @ts-expect-error it DOES have _id
      m => String(m._id) === selectedMarker,
    );
    if (marker) {
      setResourceMarker(marker);
      setMarkerType(MarkerType.RESOURCE);
      setMapMarker({ coords: marker.coords, respawnTime: marker.respawnTime });
      setSelectedCoords(marker.coords);
    }
  }, [selectedMarker, isResourcesFetched]);

  useEffect(() => {
    if (!mapMarker) return;
    const coordsChanged =
      JSON.stringify(mapMarker?.coords) !== JSON.stringify(selectedCoords);
    if (!coordsChanged) return;

    setMapMarker({
      ...mapMarker,
      coords: selectedCoords,
    });
  }, [selectedCoords]);

  const onSave = () => {
    if (markerType === MarkerType.MONSTER && monsterMarker && mapMarker) {
      mutateUpdateMonsterMarker({
        ...monsterMarker,
        ...mapMarker,
        respawnTime: mapMarker.respawnTime ?? undefined,
        id: String(selectedMarker),
      });
      setSelectedMarker(null);
    }
    if (markerType === MarkerType.RESOURCE && resourceMarker && mapMarker) {
      mutateUpdateResourceMarker({
        ...resourceMarker,
        ...mapMarker,
        respawnTime: mapMarker.respawnTime ?? undefined,
        id: String(selectedMarker),
      });
      setSelectedMarker(null);
    }
  };

  const onDelete = () => {
    if (!selectedMarker) return;
    if (markerType === MarkerType.MONSTER)
      mutateDeleteMonsterMarker({ markerId: selectedMarker });
    if (markerType === MarkerType.RESOURCE)
      mutateDeleteResourceMarker({ markerId: selectedMarker });
    setSelectedMarker(null);
  };

  return {
    markerType,
    monsters,
    monsterMarker,
    setMonsterMarker,
    resources,
    resourceMarker,
    mapMarker,
    setMapMarker,
    setResourceMarker,
    onSave,
    onDelete,
  };
};

const useStatus = (setStatus: (status: Status) => void) => {
  const {
    mutate: mutateUpdateMonsterMarker,
    isSuccess: isUpdateMSuccess,
    isError: isUpdateMError,
    isPending: isUpdateMPending,
  } = useAdminUpdateMonsterMarkerApi();
  const {
    mutate: mutateDeleteMonsterMarker,
    isSuccess: isDeleteMSuccess,
    isError: isDeleteMError,
    isPending: isDeleteMPending,
  } = useAdminDeleteMonsterMarkerApi();
  const {
    mutate: mutateUpdateResourceMarker,
    isSuccess: isUpdateRSuccess,
    isError: isUpdateRError,
    isPending: isUpdateRPending,
  } = useAdminUpdateResourceMarkerApi();
  const {
    mutate: mutateDeleteResourceMarker,
    isSuccess: isDeleteRSuccess,
    isError: isDeleteRError,
    isPending: isDeleteRPending,
  } = useAdminDeleteResourceMarkerApi();

  useEffect(() => {
    setStatus({
      isSuccess: isUpdateMSuccess,
      isError: isUpdateMError,
      isPending: isUpdateMPending,
    });
  }, [isUpdateMSuccess, isUpdateMPending, isUpdateMError]);

  useEffect(() => {
    setStatus({
      isSuccess: isDeleteMSuccess,
      isError: isDeleteMError,
      isPending: isDeleteMPending,
    });
  }, [isDeleteMSuccess, isDeleteMPending, isDeleteMError]);

  useEffect(() => {
    setStatus({
      isSuccess: isUpdateRSuccess,
      isError: isUpdateRError,
      isPending: isUpdateRPending,
    });
  }, [isUpdateRSuccess, isUpdateRPending, isUpdateRError]);

  useEffect(() => {
    setStatus({
      isSuccess: isDeleteRSuccess,
      isError: isDeleteRError,
      isPending: isDeleteRPending,
    });
  }, [isDeleteRSuccess, isDeleteRPending, isDeleteRError]);

  return {
    mutateUpdateMonsterMarker,
    mutateDeleteMonsterMarker,
    mutateUpdateResourceMarker,
    mutateDeleteResourceMarker,
  };
};
