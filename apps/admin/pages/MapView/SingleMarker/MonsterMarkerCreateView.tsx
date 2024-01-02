import { useEffect, useState } from 'react';
import { FormControlLabel, Switch } from '@mui/material';
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
    onTextPropertyChange,
    onNumberPropertyChange,
    onCreate,
  } = useUpdateMonsterMarker(selectedCoords, setStatus);

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
          <Select
            name="monster_marker"
            label="Monster on marker"
            data={monsters.map(m => ({ id: m.id, name: m.name }))}
            defaultSelected={marker?.monsterId ?? monsters[0].id}
            setValue={newMonster =>
              onTextPropertyChange(newMonster, 'monsterId')
            }
          />
        </div>
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
            <div
              className={modifiers(s, 'markerView__section', {
                hidden: true,
              })}>
              <Input
                name="marker_level"
                label="Monster level"
                value={String(marker?.level)}
                setValue={newLevel => onNumberPropertyChange(newLevel, 'level')}
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

const useUpdateMonsterMarker = (
  selectedCoords: number[],
  setStatus: (status: Status) => void,
) => {
  const [marker, setMarker] = useState<
    Omit<MonsterMarker, 'id' | 'respawnTime'>
  >(DEFAULT_MONSTER_MARKER);
  const { data: monsters } = useMonstersApi();

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
    if (marker) mutate(marker);
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
