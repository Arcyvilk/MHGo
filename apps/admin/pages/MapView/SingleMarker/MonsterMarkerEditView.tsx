import { useEffect, useMemo, useState } from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { MonsterMarker } from '@mhgo/types';
import {
  Button,
  Input,
  Select,
  modifiers,
  useAdminAllMonsterMarkers,
  useAdminDeleteMonsterMarkerApi,
  useAdminUpdateMonsterMarkerApi,
  useMonstersApi,
} from '@mhgo/front';
import { ActionBar } from '../../../containers';

import s from './SingleMarkerView.module.scss';
import { Status } from '../../../utils/types';

type MonsterMarkerProps = {
  selectedMarker: string;
  setSelectedMarker: (selectedMarker: string | null) => void;
  selectedCoords: number[];
  onCancel: () => void;
  setStatus: (status: Status) => void;
};
export const MonsterMarkerEditView = ({
  selectedMarker,
  setSelectedMarker,
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
    onDelete,
  } = useUpdateMonsterMarker(
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
                  onNumberPropertyChange(checked ? null : '1', 'level')
                }
              />
            }
          />
          {updatedMarker?.level !== null ? (
            <div
              className={modifiers(s, 'markerView__section', {
                hidden: true,
              })}>
              <Input
                name="marker_level"
                label="Monster level"
                value={String(updatedMarker?.level)}
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

// selectedMarker is in fact ObjectId from MongoDB
const useUpdateMonsterMarker = (
  selectedMarker: string,
  setSelectedMarker: (selectedMarker: string | null) => void,
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
    if (updatedMarker) {
      mutateUpdate({
        ...updatedMarker,
        id: String(selectedMarker),
      });
    }
  };

  const onDelete = () => {
    if (selectedMarker) {
      mutateDelete({ markerId: selectedMarker });
      setSelectedMarker(null);
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
    newValue: string | null,
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
    onDelete,
  };
};
