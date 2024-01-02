import { useEffect, useMemo, useState } from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { MonsterMarker } from '@mhgo/types';
import {
  Button,
  Input,
  Select,
  useAdminAllMonsterMarkers,
  useAdminUpdateMonsterMarkerApi,
  useMonstersApi,
} from '@mhgo/front';
import { ActionBar } from '../../../containers';

import s from './SingleMarkerView.module.scss';
import { Status } from '../../../utils/types';

type MonsterMarkerProps = {
  selectedMarker: string;
  selectedCoords: number[];
  onCancel: () => void;
  setStatus: (status: Status) => void;
};
export const MonsterMarkerEditView = ({
  selectedMarker,
  selectedCoords,
  onCancel,
  setStatus,
}: MonsterMarkerProps) => {
  const {
    marker,
    monsters,
    updatedMarker,
    onTextPropertyChange,
    onNumberPropertyChange,
    onSave,
  } = useUpdateMonsterMarker(selectedMarker, selectedCoords, setStatus);

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
          <Select
            name="monster_marker"
            label="Monster on marker"
            data={monsters.map(m => ({ id: m.id, name: m.name }))}
            defaultSelected={marker?.monsterId}
            setValue={newMonster =>
              onTextPropertyChange(newMonster, 'monsterId')
            }
          />
        </div>
        <div className={s.markerView__section}>
          <Input
            name="marker_lat"
            label="Latitude"
            value={String(updatedMarker?.coords[0])}
            setValue={newLat => onNumberPropertyChange(newLat, 'lat')}
          />
          <Input
            name="marker_long"
            label="Longitude"
            value={String(updatedMarker?.coords[1])}
            setValue={newLong => onNumberPropertyChange(newLong, 'long')}
          />
        </div>
        <div className={s.markerView__section}>
          <FormControlLabel
            label="Random level?"
            control={
              <Switch
                color="default"
                checked={!updatedMarker?.level}
                onChange={(_, checked) =>
                  onNumberPropertyChange(String(checked ? null : 1), 'level')
                }
              />
            }
          />
          <Input
            name="marker_level"
            label="Monster level"
            value={String(updatedMarker?.level)}
            setValue={newLevel => onNumberPropertyChange(newLevel, 'level')}
          />
        </div>
      </div>
      <ActionBar
        buttons={
          <>
            <Button
              label="Cancel"
              variant={Button.Variant.DANGER}
              onClick={onCancel}
            />
            <Button label="Save" onClick={onSave} />
          </>
        }
      />
    </div>
  );
};

// selectedMarker is in fact ObjectId from MongoDB
const useUpdateMonsterMarker = (
  selectedMarker: string,
  selectedCoords: number[],
  setStatus: (status: Status) => void,
) => {
  const { data: monsters } = useMonstersApi();
  const { data: monsterMarkers, isFetched: isMarkersFetched } =
    useAdminAllMonsterMarkers();

  const marker = useMemo(() => {
    return monsterMarkers.find(
      // @ts-expect-error it DOES have _id
      monsterMarker => String(monsterMarker._id) === selectedMarker,
    );
  }, [selectedMarker, isMarkersFetched]);

  const [updatedMarker, setUpdatedMarker] = useState(marker);

  useEffect(() => {
    setUpdatedMarker(marker);
  }, [isMarkersFetched]);

  useEffect(() => {
    if (!updatedMarker) return;
    if (JSON.stringify(updatedMarker.coords) === JSON.stringify(selectedCoords))
      return;

    setUpdatedMarker({
      ...updatedMarker,
      coords: selectedCoords,
    });
  }, [selectedCoords]);

  const { mutate, isSuccess, isError, isPending } =
    useAdminUpdateMonsterMarkerApi();

  useEffect(() => {
    setStatus({ isSuccess, isError, isPending });
  }, [isSuccess, isError, isPending]);

  const onSave = () => {
    if (updatedMarker) {
      mutate({
        ...updatedMarker,
        id: String(selectedMarker),
      });
    }
  };

  const onTextPropertyChange = (
    newValue: string,
    property: keyof Pick<MonsterMarker, 'monsterId'>,
  ) => {
    if (!updatedMarker) return;
    setUpdatedMarker({
      ...updatedMarker,
      [property]: newValue,
    });
  };

  const onNumberPropertyChange = (
    newValue: string,
    property: keyof Pick<MonsterMarker, 'level'> | 'lat' | 'long',
  ) => {
    if (!updatedMarker) return;

    if (property !== 'lat' && property !== 'long') {
      setUpdatedMarker({
        ...updatedMarker,
        [property]: newValue === null ? null : Number(newValue),
      });
    }

    if (property === 'lat') {
      setUpdatedMarker({
        ...updatedMarker,
        coords: [Number(newValue), updatedMarker.coords[1]],
      });
    }

    if (property === 'long') {
      setUpdatedMarker({
        ...updatedMarker,
        coords: [updatedMarker.coords[0], Number(newValue)],
      });
    }
  };

  return {
    marker,
    monsters,
    updatedMarker,
    onTextPropertyChange,
    onNumberPropertyChange,
    onSave,
    isSuccess,
    isPending,
    isError,
  };
};
