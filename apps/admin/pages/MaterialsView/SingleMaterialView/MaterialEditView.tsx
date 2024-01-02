import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CDN_URL } from '@mhgo/front/env';
import { Material } from '@mhgo/types';
import {
  Button,
  Input,
  Item,
  useAdminUpdateMaterialApi,
  useMaterialsApi,
  useMonsterDropsApi,
} from '@mhgo/front';
import { ActionBar, HeaderEdit } from '../../../containers';

import s from './SingleMaterialView.module.scss';

export const MaterialEditView = () => {
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
            This material does not exist
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
      />
      <ActionBar
        title={`Material ID: ${updatedMaterial?.id}`}
        buttons={
          <>
            <Button
              label="Cancel"
              onClick={() => navigate(-1)}
              variant={Button.Variant.DANGER}
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
              max={5}
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
                price: 0,
                img: `${CDN_URL}${materialImg}`,
              }}
            />
          </div>
          <div className={s.singleMaterialView__section}>
            <div className={s.singleMaterialView__infoSection}>
              <p
                style={{ fontWeight: 600 }}
                className={s.singleMaterialView__withInfo}>
                Dropped by
              </p>
              {materialDrops.map(drop => (
                <Button
                  variant={Button.Variant.GHOST}
                  simple
                  label={`${drop.monsterId} (level ${drop.level})`}
                  onClick={() =>
                    navigate(`/monsters/edit?id=${drop.monsterId}`)
                  }
                />
              ))}
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

  const { data: materials, isFetched: isMaterialsFetched } = useMaterialsApi();
  const { data: drops, isFetched: isDropsFetched } = useMonsterDropsApi();

  const material = useMemo(
    () => materials.find(i => i.id === id),
    [materials, isMaterialsFetched],
  );
  const [updatedMaterial, setUpdatedMaterial] = useState(material);

  const materialDrops = useMemo(() => {
    const monsters: { monsterId: string; level: number }[] = [];
    drops.forEach(drop =>
      drop.drops.map(levelDrop => {
        if (levelDrop.drops.some(d => d.id === material?.id))
          monsters.push({ monsterId: drop.monsterId, level: levelDrop.level });
      }),
    );
    return monsters;
  }, [drops, isDropsFetched]);

  useEffect(() => {
    setUpdatedMaterial(material);
  }, [isMaterialsFetched]);

  const { mutate, isSuccess, isError, isPending } = useAdminUpdateMaterialApi();

  const materialImg = useMemo(
    () => updatedMaterial?.img.replace(CDN_URL, '') ?? '',
    [materials],
  );

  const onSave = () => {
    if (updatedMaterial) mutate(updatedMaterial);
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
