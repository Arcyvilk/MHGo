import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CDN_URL } from '@mhgo/front/env';
import {
  Button,
  Input,
  Loader,
  QueryBoundary,
  removeCdnUrl,
  useAdminUpdateBiomeApi,
  useBiomesApi,
} from '@mhgo/front';
import { ActionBar, HeaderEdit } from '../../../containers';
import { BiomeSpawns } from './BiomeSpawns';
import { validateBiome } from './validation';

import s from './SingleBiomeView.module.scss';

export const BiomeEditView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const navigate = useNavigate();
  const {
    biome,
    updatedBiome,
    biomeImg,
    biomeThumbnail,
    setUpdatedBiome,
    onSave,
    isSuccess,
    isPending,
    isError,
  } = useUpdateBiome();

  if (!biome)
    return (
      <div className={s.singleBiomeView}>
        <div className={s.singleBiomeView__header}>
          <h1 className={s.singleBiomeView__title}>
            This biome does not exist!
          </h1>
        </div>
        <div className={s.singleBiomeView__footer}>
          <Button label="Back" onClick={() => navigate(-1)} />
        </div>
      </div>
    );

  return (
    <div className={s.singleBiomeView}>
      <HeaderEdit
        status={{ isSuccess, isPending, isError }}
        title="Edit biome"
        hasBackButton={true}
      />
      <ActionBar
        title={`Biome ID: ${updatedBiome?.id}`}
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
      <div className={s.singleBiomeView__content}>
        <div className={s.singleBiomeView__section}>
          <Input
            name="biome_name"
            label="Biome's name"
            value={updatedBiome?.name ?? ''}
            setValue={name =>
              updatedBiome && setUpdatedBiome({ ...updatedBiome, name })
            }
          />
          <Input
            name="biome_desc"
            label="Biome's description"
            value={updatedBiome?.description ?? ''}
            setValue={description =>
              updatedBiome &&
              setUpdatedBiome({ ...updatedBiome, description })
            }
          />
        </div>
        <div
          className={s.singleBiomeView__section}
          style={{ alignItems: 'center' }}>
          <Input
            name="biome_image"
            label="Path to biome image"
            value={biomeImg}
            setValue={image =>
              updatedBiome && setUpdatedBiome({ ...updatedBiome, image })
            }
          />
          <img src={`${CDN_URL}${biomeImg}`} style={{ maxWidth: '256px' }} />
        </div>
        <div
          className={s.singleBiomeView__section}
          style={{ alignItems: 'center' }}>
          <Input
            name="biome_thumbnail"
            label="Path to biome thumbnail"
            value={biomeThumbnail}
            setValue={thumbnail =>
              updatedBiome &&
              setUpdatedBiome({ ...updatedBiome, thumbnail })
            }
          />
          <img
            src={`${CDN_URL}${biomeThumbnail}`}
            style={{ maxWidth: '64px' }}
          />
        </div>
      </div>
      <div className={s.singleBiomeView__content}>
        {updatedBiome && setUpdatedBiome && (
          <div className={s.singleBiomeView__section}>
            <BiomeSpawns
              biome={updatedBiome}
              setBiome={setUpdatedBiome}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const useUpdateBiome = () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  const { data: biomes, isFetched: isBiomesFetched } = useBiomesApi();

  const biome = useMemo(
    () => biomes.find(i => i.id === id),
    [biomes, isBiomesFetched],
  );
  const [updatedBiome, setUpdatedBiome] = useState(biome);

  useEffect(() => {
    setUpdatedBiome(biome);
  }, [isBiomesFetched]);

  const { mutate, isSuccess, isError, isPending } = useAdminUpdateBiomeApi();

  const biomeImg = useMemo(
    () => removeCdnUrl(updatedBiome?.image),
    [biomes],
  );
  const biomeThumbnail = useMemo(
    () => removeCdnUrl(updatedBiome?.thumbnail),
    [biomes],
  );

  const onSave = () => {
    const isValid = validateBiome(updatedBiome);
    if (isValid && updatedBiome)
      mutate({
        ...updatedBiome,
        image: biomeImg,
      });
  };

  return {
    biome,
    biomeImg,
    biomeThumbnail,
    updatedBiome,
    setUpdatedBiome,
    onSave,
    isSuccess,
    isPending,
    isError,
  };
};
