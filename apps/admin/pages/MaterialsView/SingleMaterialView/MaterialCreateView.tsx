import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CDN_URL } from '@mhgo/front/env';
import { Material } from '@mhgo/types';
import { Button, Input, Item, useAdminCreateMaterialApi } from '@mhgo/front';
import { ActionBar, HeaderEdit } from '../../../containers';
import { DEFAULT_MATERIAL } from '../../../utils/defaults';

import s from './SingleMaterialView.module.scss';

export const MaterialCreateView = () => {
  const navigate = useNavigate();
  const {
    material,
    materialImg,
    onTextPropertyChange,
    onNumberPropertyChange,
    onCreate,
    isSuccess,
    isPending,
    isError,
  } = useUpdateMaterial();

  return (
    <div className={s.singleMaterialView}>
      <HeaderEdit
        status={{ isSuccess, isPending, isError }}
        title="Edit material"
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
      <div className={s.singleMaterialView__content}>
        <div className={s.singleMaterialView__content}>
          <div className={s.singleMaterialView__section}>
            <Input
              name="material_name"
              label="Material's name"
              value={material?.name ?? ''}
              setValue={newName => onTextPropertyChange(newName, 'name')}
            />
            <Input
              name="material_desc"
              label="Material's description"
              value={material?.description ?? ''}
              setValue={newDesc => onTextPropertyChange(newDesc, 'description')}
            />
            {/* <Input
              name="material_obtainedAt"
              label="Where material can be obtained?"
              value={material?.obtainedAt ?? ''}
              setValue={newObtained =>
                onTextPropertyChange(newObtained, 'obtainedAt')
              }
            /> */}
            <Input
              name="material_rarity"
              label="Material's rarity"
              min={1}
              max={5}
              type="number"
              value={String(material?.rarity ?? 1)}
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
                ...(material ?? material),
                purchasable: false,
                price: 0,
                img: `${CDN_URL}${materialImg}`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const useUpdateMaterial = () => {
  const [material, setMaterial] = useState<Material>(DEFAULT_MATERIAL);

  const { mutate, isSuccess, isError, isPending } = useAdminCreateMaterialApi();

  const materialImg = useMemo(
    () => material?.img.replace(CDN_URL, '') ?? '',
    [material],
  );

  const onCreate = () => {
    if (material)
      mutate({
        ...material,
        img: materialImg,
      });
  };

  const onTextPropertyChange = (newValue: string, property: keyof Material) => {
    if (!material) return;
    setMaterial({
      ...material,
      [property]: newValue,
    });
  };

  const onNumberPropertyChange = (
    newValue: string,
    property: keyof Material,
  ) => {
    if (!material) return;
    setMaterial({
      ...material,
      [property]: Number(newValue),
    });
  };

  return {
    material,
    materialImg,
    onTextPropertyChange,
    onNumberPropertyChange,
    onCreate,
    isSuccess,
    isPending,
    isError,
  };
};
