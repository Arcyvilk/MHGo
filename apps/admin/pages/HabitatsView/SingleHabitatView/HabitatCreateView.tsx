import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CDN_URL } from '@mhgo/front/env';
import { Habitat } from '@mhgo/types';
import {
  Button,
  Input,
  Loader,
  QueryBoundary,
  removeCdnUrl,
  useAdminCreateHabitatApi,
} from '@mhgo/front';

import { ActionBar, HeaderEdit } from '../../../containers';
import { DEFAULT_HABITAT } from '../../../utils/defaults';

import s from './SingleHabitatView.module.scss';

export const HabitatCreateView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const navigate = useNavigate();
  const {
    habitat,
    habitatImg,
    setHabitat,
    onCreate,
    isSuccess,
    isPending,
    isError,
  } = useUpdateHabitat();

  return (
    <div className={s.singleHabitatView}>
      <HeaderEdit
        status={{ isSuccess, isPending, isError }}
        title="Create habitat"
      />
      <ActionBar
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
              label="Create"
              onClick={onCreate}
              variant={Button.Variant.ACTION}
            />
          </>
        }
      />
      <div className={s.singleHabitatView__content}>
        <div className={s.singleHabitatView__content}>
          <div className={s.singleHabitatView__section}>
            <Input
              name="habitat_name"
              label="Habitat's name"
              value={habitat?.name ?? ''}
              setValue={name => setHabitat({ ...habitat, name })}
            />
            <Input
              name="habitat_desc"
              label="Habitat's description"
              value={habitat?.description ?? ''}
              setValue={description => setHabitat({ ...habitat, description })}
            />
          </div>
          <div
            className={s.singleHabitatView__section}
            style={{ alignItems: 'center' }}>
            <Input
              name="habitat_img"
              label="Path to habitat image"
              value={habitatImg}
              setValue={image => setHabitat({ ...habitat, image })}
            />
            <img
              src={`${CDN_URL}${habitatImg}`}
              style={{ maxWidth: '256px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const useUpdateHabitat = () => {
  const [habitat, setHabitat] = useState<Habitat>(DEFAULT_HABITAT);

  const { mutate, isSuccess, isError, isPending } = useAdminCreateHabitatApi();

  const habitatImg = useMemo(() => removeCdnUrl(habitat?.image), [habitat]);

  const onCreate = () => {
    if (habitat)
      mutate({
        ...habitat,
        image: habitatImg,
      });
  };

  return {
    habitat,
    habitatImg,
    setHabitat,
    onCreate,
    isSuccess,
    isPending,
    isError,
  };
};
