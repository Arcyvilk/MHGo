import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CDN_URL } from '@mhgo/front/env';
import { Material } from '@mhgo/types';
import {
  Button,
  Input,
  Item,
  Loader,
  QueryBoundary,
  removeCdnUrl,
  useAdminUpdateMaterialApi,
  useMaterialsApi,
  useMonsterDropsApi,
  useResourceDropsApi,
} from '@mhgo/front';
import { ActionBar, HeaderEdit } from '../../../containers';

import s from './SingleMaterialView.module.scss';

export const MaterialEditView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const navigate = useNavigate();
  const {
    material,
    updatedMaterial,
    materialImg,
    materialDrops,
    onTextPropertyChange,
    onNumberPropertyChange,
    onSave,
    isSuccess,
    isPending,
    isError,
  } = useUpdateMaterial();

  if (!material)
    return (
      <div className={s.singleMaterialView}>
        <div className={s.singleMaterialView__header}>
          <h1 className={s.singleMaterialView__title}>
            This material does not exist!
          </h1>
        </div>
        <div className={s.singleMaterialView__footer}>
          <Button label="Back" onClick={() => navigate(-1)} />
        </div>
      </div>
    );

  return (
    <div className={s.singleMaterialView}>
      <HeaderEdit
        status={{ isSuccess, isPending, isError }}
        title="Edit material"
        hasBackButton={true}
      />
      <ActionBar
        title={`Material ID: ${updatedMaterial?.id}`}
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
      <div className={s.singleMaterialView__content}>
        <div className={s.singleMaterialView__content}>
          <div className={s.singleMaterialView__section}>
            <Input
              name="material_name"
              label="Material's name"
              value={updatedMaterial?.name ?? ''}
              setValue={newName => onTextPropertyChange(newName, 'name')}
            />
            <Input
              name="material_desc"
              label="Material's description"
              value={updatedMaterial?.description ?? ''}
              setValue={newDesc => onTextPropertyChange(newDesc, 'description')}
            />
            <Input
              name="material_rarity"
              label="Material's rarity"
              min={1}
              max={6}
              type="number"
              value={String(updatedMaterial?.rarity ?? 1)}
              setValue={newRarity =>
                onNumberPropertyChange(newRarity, 'rarity')
              }
            />
          </div>
          <div
            className={s.singleMaterialView__section}
            style={{ alignItems: 'center' }}>
            <Input
              name="material_img"
              label="Path to material image"
              value={materialImg}
              setValue={newPath => onTextPropertyChange(newPath, 'img')}
            />
            <Item
              data={{
                ...(updatedMaterial ?? material),
                purchasable: false,
                img: `${CDN_URL}${materialImg}`,
              }}
            />
          </div>
          <div className={s.singleMaterialView__section}>
            <div className={s.singleMaterialView__infoSection}>
              <p
                style={{ fontWeight: 600 }}
                className={s.singleMaterialView__withInfo}>
                Dropped by monsters:
              </p>
              {materialDrops.monsters.length > 0
                ? materialDrops.monsters.map(drop => (
                    <Button
                      variant={Button.Variant.GHOST}
                      simple
                      inverted
                      label={`LVL ${
                        drop.level
                      } ${drop.monsterId.toUpperCase()} [x${drop.amount}] [${
                        drop.chance
                      }%]`}
                      onClick={() =>
                        navigate(`/monsters/edit?id=${drop.monsterId}`)
                      }
                    />
                  ))
                : '-'}
            </div>
          </div>
          <div className={s.singleMaterialView__section}>
            <div className={s.singleMaterialView__infoSection}>
              <p
                style={{ fontWeight: 600 }}
                className={s.singleMaterialView__withInfo}>
                Dropped by resource points:
              </p>
              {materialDrops.resourceDrops.length > 0
                ? materialDrops.resourceDrops.map(resource => (
                    <Button
                      variant={Button.Variant.GHOST}
                      simple
                      inverted
                      label={`${resource.name.toUpperCase()} [x${
                        resource.amount
                      }] [${resource.chance}%]`}
                      onClick={() =>
                        navigate(`/resources/edit?id=${resource.id}`)
                      }
                    />
                  ))
                : '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const useUpdateMaterial = () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  const { data: materials, isFetched: isMaterialsFetched } =
    useMaterialsApi(true);
  const { data: dropMonsters, isFetched: isDropMonstersFetched } =
    useMonsterDropsApi();
  const { data: dropResources, isFetched: isDropResourcesFetched } =
    useResourceDropsApi();

  const material = useMemo(
    () => materials.find(i => i.id === id),
    [materials, isMaterialsFetched],
  );
  const [updatedMaterial, setUpdatedMaterial] = useState(material);

  const materialDrops = useMemo(() => {
    const monsters: {
      monsterId: string;
      level: number;
      chance: number;
      amount: number;
    }[] = [];
    dropMonsters.forEach(drop =>
      drop.drops.map(levelDrop => {
        const isDropped = levelDrop.drops.find(d => d.id === material?.id);
        if (isDropped)
          monsters.push({
            monsterId: drop.monsterId,
            level: levelDrop.level,
            chance: isDropped.chance,
            amount: isDropped.amount,
          });
      }),
    );
    const resourceDrops: {
      id: string;
      name: string;
      chance: number;
      amount: number;
    }[] = [];
    dropResources.forEach(resource =>
      resource.drops.map(resourceDrop => {
        const isDropped = resourceDrop.id === material?.id;
        if (isDropped)
          resourceDrops.push({
            id: resource.resourceId,
            name: resource.resourceId,
            chance: resourceDrop.chance,
            amount: resourceDrop.amount,
          });
      }),
    );

    return { monsters, resourceDrops };
  }, [
    dropMonsters,
    dropResources,
    isDropMonstersFetched,
    isDropResourcesFetched,
  ]);

  useEffect(() => {
    setUpdatedMaterial(material);
  }, [isMaterialsFetched]);

  const { mutate, isSuccess, isError, isPending } = useAdminUpdateMaterialApi();

  const materialImg = useMemo(
    () => removeCdnUrl(updatedMaterial?.img),
    [materials],
  );

  const onSave = () => {
    if (updatedMaterial)
      mutate({
        ...updatedMaterial,
        img: materialImg,
      });
  };

  const onTextPropertyChange = (newValue: string, property: keyof Material) => {
    if (!updatedMaterial) return;
    setUpdatedMaterial({
      ...updatedMaterial,
      [property]: newValue,
    });
  };

  const onNumberPropertyChange = (
    newValue: string,
    property: keyof Material,
  ) => {
    if (!updatedMaterial) return;
    setUpdatedMaterial({
      ...updatedMaterial,
      [property]: Number(newValue),
    });
  };

  return {
    material,
    materialImg,
    materialDrops,
    updatedMaterial,
    onTextPropertyChange,
    onNumberPropertyChange,
    onSave,
    isSuccess,
    isPending,
    isError,
  };
};
