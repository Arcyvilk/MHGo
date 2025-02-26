import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CDN_URL } from '@mhgo/front/env';
import { Biome } from '@mhgo/types';
import {
  Button,
  Input,
  Loader,
  QueryBoundary,
  removeCdnUrl,
  useAdminCreateBiomeApi,
} from '@mhgo/front';

import { ActionBar, HeaderEdit } from '../../../containers';
import { DEFAULT_HABITAT } from '../../../utils/defaults';
import { BiomeSpawns } from './BiomeSpawns';
import { validateBiome } from './validation';

import s from './SingleBiomeView.module.scss';

export const BiomeCreateView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const navigate = useNavigate();
  const {
    biome,
    biomeImg,
    biomeThumbnail,
    setBiome,
    onCreate,
    isSuccess,
    isPending,
    isError,
  } = useUpdateBiome();

  return (
    <div className={s.singleBiomeView}>
      <HeaderEdit
        status={{ isSuccess, isPending, isError }}
        title="Create biome"
        hasBackButton={true}
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
      <div className={s.singleBiomeView__content}>
        <div className={s.singleBiomeView__content}>
          <div className={s.singleBiomeView__section}>
            <Input
              name="biome_name"
              label="Biome's name"
              value={biome?.name ?? ''}
              setValue={name => setBiome({ ...biome, name })}
            />
            <Input
              name="biome_desc"
              label="Biome's description"
              value={biome?.description ?? ''}
              setValue={description => setBiome({ ...biome, description })}
            />
          </div>
          <div
            className={s.singleBiomeView__section}
            style={{ alignItems: 'center' }}>
            <Input
              name="biome_img"
              label="Path to biome image"
              value={biomeImg}
              setValue={image => setBiome({ ...biome, image })}
            />
            <img
              src={`${CDN_URL}${biomeImg}`}
              style={{ maxWidth: '256px' }}
            />
          </div>
          <div
            className={s.singleBiomeView__section}
            style={{ alignItems: 'center' }}>
            <Input
              name="biome_thumbnail"
              label="Path to biome thumbnail"
              value={biomeThumbnail}
              setValue={thumbnail => setBiome({ ...biome, thumbnail })}
            />
            <img
              src={`${CDN_URL}${biomeThumbnail}`}
              style={{ maxWidth: '64px' }}
            />
          </div>
          <div
            className={s.singleBiomeView__section}
            style={{ alignItems: 'center' }}>
            <BiomeSpawns biome={biome} setBiome={setBiome} />
          </div>
        </div>
      </div>
    </div>
  );
};

const useUpdateBiome = () => {
  const [biome, setBiome] = useState<Biome>(DEFAULT_HABITAT);

  const { mutate, isSuccess, isError, isPending } = useAdminCreateBiomeApi();

  const biomeImg = useMemo(() => removeCdnUrl(biome?.image), [biome]);
  const biomeThumbnail = useMemo(
    () => removeCdnUrl(biome?.thumbnail),
    [biome],
  );

  const onCreate = () => {
    const isValid = validateBiome(biome);
    if (isValid && biome)
      mutate({
        ...biome,
        image: biomeImg,
      });
  };

  return {
    biome,
    biomeImg,
    biomeThumbnail,
    setBiome,
    onCreate,
    isSuccess,
    isPending,
    isError,
  };
};
