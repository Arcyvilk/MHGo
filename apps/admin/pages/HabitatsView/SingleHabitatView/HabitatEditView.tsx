import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CDN_URL } from '@mhgo/front/env';
import {
  Button,
  Input,
  Loader,
  QueryBoundary,
  removeCdnUrl,
  useAdminUpdateHabitatApi,
  useHabitatsApi,
} from '@mhgo/front';
import { ActionBar, HeaderEdit } from '../../../containers';
import { HabitatSpawns } from './HabitatSpawns';
import { validateHabitat } from './validation';

import s from './SingleHabitatView.module.scss';

export const HabitatEditView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const navigate = useNavigate();
  const {
    habitat,
    updatedHabitat,
    habitatImg,
    habitatThumbnail,
    setUpdatedHabitat,
    onSave,
    isSuccess,
    isPending,
    isError,
  } = useUpdateHabitat();

  if (!habitat)
    return (
      <div className={s.singleHabitatView}>
        <div className={s.singleHabitatView__header}>
          <h1 className={s.singleHabitatView__title}>
            This habitat does not exist!
          </h1>
        </div>
        <div className={s.singleHabitatView__footer}>
          <Button label="Back" onClick={() => navigate(-1)} />
        </div>
      </div>
    );

  return (
    <div className={s.singleHabitatView}>
      <HeaderEdit
        status={{ isSuccess, isPending, isError }}
        title="Edit habitat"
        hasBackButton={true}
      />
      <ActionBar
        title={`Habitat ID: ${updatedHabitat?.id}`}
        buttons={
          <>
            <Button
              label="Cancel"
              inverted
              simple
              onClick={() => navigate(-1)}
              variant={Button.Variant.GHOST}
            />
            <Button
              label="Save"
              onClick={onSave}
              variant={Button.Variant.ACTION}
            />
          </>
        }
      />
      <div className={s.singleHabitatView__content}>
        <div className={s.singleHabitatView__section}>
          <Input
            name="habitat_name"
            label="Habitat's name"
            value={updatedHabitat?.name ?? ''}
            setValue={name =>
              updatedHabitat && setUpdatedHabitat({ ...updatedHabitat, name })
            }
          />
          <Input
            name="habitat_desc"
            label="Habitat's description"
            value={updatedHabitat?.description ?? ''}
            setValue={description =>
              updatedHabitat &&
              setUpdatedHabitat({ ...updatedHabitat, description })
            }
          />
        </div>
        <div
          className={s.singleHabitatView__section}
          style={{ alignItems: 'center' }}>
          <Input
            name="habitat_image"
            label="Path to habitat image"
            value={habitatImg}
            setValue={image =>
              updatedHabitat && setUpdatedHabitat({ ...updatedHabitat, image })
            }
          />
          <img src={`${CDN_URL}${habitatImg}`} style={{ maxWidth: '256px' }} />
        </div>
        <div
          className={s.singleHabitatView__section}
          style={{ alignItems: 'center' }}>
          <Input
            name="habitat_thumbnail"
            label="Path to habitat thumbnail"
            value={habitatThumbnail}
            setValue={thumbnail =>
              updatedHabitat &&
              setUpdatedHabitat({ ...updatedHabitat, thumbnail })
            }
          />
          <img
            src={`${CDN_URL}${habitatThumbnail}`}
            style={{ maxWidth: '64px' }}
          />
        </div>
      </div>
      <div className={s.singleHabitatView__content}>
        {updatedHabitat && setUpdatedHabitat && (
          <div className={s.singleHabitatView__section}>
            <HabitatSpawns
              habitat={updatedHabitat}
              setHabitat={setUpdatedHabitat}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const useUpdateHabitat = () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  const { data: habitats, isFetched: isHabitatsFetched } = useHabitatsApi();

  const habitat = useMemo(
    () => habitats.find(i => i.id === id),
    [habitats, isHabitatsFetched],
  );
  const [updatedHabitat, setUpdatedHabitat] = useState(habitat);

  useEffect(() => {
    setUpdatedHabitat(habitat);
  }, [isHabitatsFetched]);

  const { mutate, isSuccess, isError, isPending } = useAdminUpdateHabitatApi();

  const habitatImg = useMemo(
    () => removeCdnUrl(updatedHabitat?.image),
    [habitats],
  );
  const habitatThumbnail = useMemo(
    () => removeCdnUrl(updatedHabitat?.thumbnail),
    [habitats],
  );

  const onSave = () => {
    const isValid = validateHabitat(updatedHabitat);
    if (isValid && updatedHabitat)
      mutate({
        ...updatedHabitat,
        image: habitatImg,
      });
  };

  return {
    habitat,
    habitatImg,
    habitatThumbnail,
    updatedHabitat,
    setUpdatedHabitat,
    onSave,
    isSuccess,
    isPending,
    isError,
  };
};
