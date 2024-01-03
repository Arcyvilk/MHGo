import { useEffect, useState } from 'react';
import { FormControlLabel, Stack, Switch, Typography } from '@mui/material';
import { MonsterMarker } from '@mhgo/types';
import {
  Button,
  Input,
  Select,
  modifiers,
  useAdminCreateMonsterMarkerApi,
  useMonstersApi,
} from '@mhgo/front';
import { ActionBar } from '../../../containers';
import { Status } from '../../../utils/types';

import s from './SingleMarkerView.module.scss';
import { DEFAULT_MONSTER_MARKER } from '../../../utils/defaults';

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
    marker,
    monsters,
    resources,
    onTextPropertyChange,
    onNumberPropertyChange,
    onCreate,
  } = useUpdateMarker(selectedCoords, setStatus, onCancel);
  const [markerType, setMarkerType] = useState(MarkerType.MONSTER);

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
            value={String(marker?.coords[0])}
            setValue={newLat => onNumberPropertyChange(newLat, 'lat')}
          />
          <Input
            name="marker_long"
            label="Longitude"
            value={String(marker?.coords[1])}
            setValue={newLong => onNumberPropertyChange(newLong, 'long')}
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
              defaultSelected={marker?.monsterId ?? monsters[0].id}
              setValue={newMonster =>
                onTextPropertyChange(newMonster, 'monsterId')
              }
            />
            <FormControlLabel
              label="Random level?"
              control={
                <Switch
                  color="default"
                  checked={!marker?.level}
                  onChange={(_, checked) =>
                    onNumberPropertyChange(checked ? null : '1', 'level')
                  }
                />
              }
            />
            {marker?.level !== null ? (
              <Input
                name="marker_level"
                label="Monster level"
                value={String(marker?.level)}
                setValue={newLevel => onNumberPropertyChange(newLevel, 'level')}
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
              defaultSelected={marker?.resourceId ?? resources[0].id}
              setValue={newResource =>
                onTextPropertyChange(newResource, 'resourceId')
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

const useUpdateMarker = (
  selectedCoords: number[],
  setStatus: (status: Status) => void,
  onCancel: () => void,
) => {
  const [marker, setMarker] = useState<
    Omit<MonsterMarker, 'id' | 'respawnTime'>
  >(DEFAULT_MONSTER_MARKER);
  const { data: monsters } = useMonstersApi();
  const resources = []; // TODO use API

  useEffect(() => {
    if (!marker) return;
    if (JSON.stringify(marker.coords) === JSON.stringify(selectedCoords))
      return;

    setMarker({
      ...marker,
      coords: selectedCoords,
    });
  }, [selectedCoords]);

  const { mutate, isSuccess, isError, isPending } =
    useAdminCreateMonsterMarkerApi();

  useEffect(() => {
    setStatus({ isSuccess, isError, isPending });
  }, [isSuccess, isError, isPending]);

  const onCreate = () => {
    if (marker) {
      mutate(marker);
      onCancel();
    }
  };

  const onTextPropertyChange = (
    newValue: string,
    property: keyof Pick<MonsterMarker, 'monsterId'>,
  ) => {
    if (!marker) return;
    setMarker({
      ...marker,
      [property]: newValue,
    });
  };

  const onNumberPropertyChange = (
    newValue: string | null,
    property: keyof Pick<MonsterMarker, 'level'> | 'lat' | 'long',
  ) => {
    if (!marker) return;

    if (property !== 'lat' && property !== 'long') {
      setMarker({
        ...marker,
        [property]: newValue === null ? null : Number(newValue),
      });
    }

    if (property === 'lat') {
      setMarker({
        ...marker,
        coords: [Number(newValue), marker.coords[1]],
      });
    }

    if (property === 'long') {
      setMarker({
        ...marker,
        coords: [marker.coords[0], Number(newValue)],
      });
    }
  };

  return {
    marker,
    monsters,
    onTextPropertyChange,
    onNumberPropertyChange,
    onCreate,
    isSuccess,
    isPending,
    isError,
  };
};
