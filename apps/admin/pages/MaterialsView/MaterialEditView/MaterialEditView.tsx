import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CDN_URL } from '@mhgo/front/env';
import { Material } from '@mhgo/types';
import {
  Button,
  Input,
  Item,
  // useAdminUpdateMaterialApi,
  useMaterialsApi,
} from '@mhgo/front';
import { ActionBar, HeaderEdit } from '../../../containers';

import s from './MaterialEditView.module.scss';
import { toast } from 'react-toastify';

export const MaterialEditView = () => {
  const navigate = useNavigate();
  const {
    material,
    updatedMaterial,
    materialImg,
    onTextPropertyChange,
    onNumberPropertyChange,
    onSave,
    // isSuccess,
    // isPending,
    // isError,
  } = useUpdateMaterial();
  // const status = { isSuccess, isPending, isError };

  if (!material)
    return (
      <div className={s.materialEditView}>
        <div className={s.materialEditView__header}>
          <h1 className={s.materialEditView__title}>
            This material does not exist
          </h1>
        </div>
        <div className={s.materialEditView__footer}>
          <Button label="Back" onClick={() => navigate(-1)} />
        </div>
      </div>
    );

  return (
    <div className={s.materialEditView}>
      <HeaderEdit
        // TODO TEMP
        status={{ isSuccess: false, isPending: false, isError: false }}
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
      <div className={s.materialEditView__content}>
        <div className={s.materialEditView__content}>
          <div className={s.materialEditView__section}>
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
            {/* <Input
              name="material_obtainedAt"
              label="Where material can be obtained?"
              value={updatedMaterial?.obtainedAt ?? ''}
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
              value={String(updatedMaterial?.rarity ?? 1)}
              setValue={newRarity =>
                onNumberPropertyChange(newRarity, 'rarity')
              }
            />
          </div>
          <div
            className={s.materialEditView__section}
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
        </div>
      </div>
    </div>
  );
};

const useUpdateMaterial = () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  const { data: materials, isFetched } = useMaterialsApi();

  const material = useMemo(
    () => materials.find(i => i.id === id),
    [materials, isFetched],
  );
  const [updatedMaterial, setUpdatedMaterial] = useState(material);

  useEffect(() => {
    setUpdatedMaterial(material);
  }, [isFetched]);

  // const { mutate, isSuccess, isError, isPending } = useAdminUpdateMaterialApi();

  const materialImg = useMemo(
    () => updatedMaterial?.img.replace(CDN_URL, '') ?? '',
    [materials],
  );

  const onSave = () => {
    if (updatedMaterial) {
      toast.info('I would save it here but its still TODO');
      // mutate(updatedMaterial);
    }
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
    updatedMaterial,
    onTextPropertyChange,
    onNumberPropertyChange,
    onSave,
    // isSuccess,
    // isPending,
    // isError,
  };
};
