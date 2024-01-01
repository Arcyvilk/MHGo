import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControlLabel, Switch } from '@mui/material';

import { CDN_URL } from '@mhgo/front/env';
import { Item as TItem } from '@mhgo/types';
import {
  Button,
  Icon,
  Input,
  Size,
  modifiers,
  useAdminUpdateItemApi,
  useItemsApi,
} from '@mhgo/front';

import s from './ItemEditView.module.scss';

export const ItemEditView = () => {
  const navigate = useNavigate();
  const {
    item,
    updatedItem,
    itemImg,
    onTextPropertyChange,
    onNumberPropertyChange,
    onBoolPropertyChange,
    onSave,
    isSuccess,
    isPending,
    isError,
  } = useUpdateItem();

  if (!item)
    return (
      <div className={s.itemEditView}>
        <div className={s.itemEditView__header}>
          <h1 className={s.itemEditView__title}>This item does not exist</h1>
        </div>
        <div className={s.itemEditView__footer}>
          <Button label="Back" onClick={() => navigate(-1)} />
        </div>
      </div>
    );

  return (
    <div className={s.itemEditView}>
      <div className={s.itemEditView__header}>
        <h1 className={s.itemEditView__title}>
          <Button
            label={<Icon icon="Back" size={Size.MICRO} />}
            onClick={() => navigate(-1)}
            style={{ width: '48px' }}
            variant={Button.Variant.GHOST}
          />
          Edit item
        </h1>
        {isPending && 'Saving...'}
        {isSuccess && 'Saved!'}
        {isError && 'Could not save!'}
      </div>
      <div className={s.itemEditView__footer}>
        <Button
          label="Cancel"
          onClick={() => navigate(-1)}
          variant={Button.Variant.DANGER}
        />
        <Button label="Save" onClick={onSave} variant={Button.Variant.ACTION} />
      </div>
      <div className={s.itemEditView__content}>
        <div className={s.itemEditView__content}>
          <div className={s.itemEditView__section}>
            <Input
              name="item_img"
              label="Path to item image"
              value={itemImg}
              setValue={newPath => onTextPropertyChange(newPath, 'img')}
            />
            <img src={`${CDN_URL}${itemImg}`} />
          </div>
          <div className={s.itemEditView__section}>
            <Input
              name="item_name"
              label="Item's name"
              value={updatedItem?.name ?? ''}
              setValue={newName => onTextPropertyChange(newName, 'name')}
            />
            <Input
              name="item_desc"
              label="Item's description"
              value={updatedItem?.description ?? ''}
              setValue={newDesc => onTextPropertyChange(newDesc, 'description')}
            />
            <Input
              name="item_obtainedAt"
              label="Where item can be obtained?"
              value={updatedItem?.obtainedAt ?? ''}
              setValue={newObtained =>
                onTextPropertyChange(newObtained, 'obtainedAt')
              }
            />
            <Input
              name="item_rarity"
              label="Item's rarity"
              min={1}
              max={5}
              type="number"
              value={String(updatedItem?.rarity ?? 1)}
              setValue={newRarity =>
                onNumberPropertyChange(newRarity, 'rarity')
              }
            />
            <FormControlLabel
              label="Available in quick use menu?"
              //
              control={
                <Switch
                  color="default"
                  checked={updatedItem?.quickUse}
                  onChange={(_, checked) =>
                    onBoolPropertyChange(checked, 'quickUse')
                  }
                />
              }
            />
          </div>
        </div>
        <div className={s.itemEditView__content}>
          {/* 
              PURCHASABLE ITEM SECTION 
          */}
          <div className={s.itemEditView__section}>
            <FormControlLabel
              label="Purchasable?"
              control={
                <Switch
                  color="default"
                  checked={updatedItem?.purchasable}
                  onChange={(_, checked) =>
                    onBoolPropertyChange(checked, 'purchasable')
                  }
                />
              }
            />
            {updatedItem?.purchasable ? (
              <div
                className={modifiers(s, 'itemEditView__section', {
                  hidden: true,
                })}>
                <Input
                  label="Item price"
                  name="item_price"
                  type="number"
                  min={0}
                  value={String(updatedItem?.price ?? 0)}
                  setValue={newPrice =>
                    onNumberPropertyChange(newPrice, 'price')
                  }
                />
              </div>
            ) : null}
          </div>
          {/* 
              CRAFTABLE ITEM SECTION 
          */}
          <div className={s.itemEditView__section}>
            <FormControlLabel
              label="Craftable?"
              control={
                <Switch
                  color="default"
                  checked={updatedItem?.craftable}
                  onChange={(_, checked) =>
                    onBoolPropertyChange(checked, 'craftable')
                  }
                />
              }
            />
            {updatedItem?.craftable ? (
              <div
                className={modifiers(s, 'itemEditView__section', {
                  hidden: true,
                })}>
                TODO
              </div>
            ) : null}
          </div>
          {/* 
              USABLE ITEM SECTION 
          */}
          <div className={s.itemEditView__section}>
            <FormControlLabel
              label="Usable?"
              control={
                <Switch
                  color="default"
                  checked={updatedItem?.usable}
                  onChange={(_, checked) =>
                    onBoolPropertyChange(checked, 'usable')
                  }
                />
              }
            />
            {updatedItem?.usable ? (
              <div
                className={modifiers(s, 'itemEditView__section', {
                  hidden: true,
                })}>
                <FormControlLabel
                  label="Consumed on use?"
                  control={
                    <Switch
                      color="default"
                      checked={updatedItem?.consumable}
                      onChange={(_, checked) =>
                        onBoolPropertyChange(checked, 'consumable')
                      }
                    />
                  }
                />
              </div>
            ) : null}
          </div>
          {/* 
              EQUIPPABLE ITEM SECTION 
          */}
          <div className={s.itemEditView__section}>
            <FormControlLabel
              label="Equippable?"
              control={
                <Switch
                  color="default"
                  checked={updatedItem?.equippable}
                  onChange={(_, checked) =>
                    onBoolPropertyChange(checked, 'equippable')
                  }
                />
              }
            />
            {updatedItem?.equippable ? (
              <div
                className={modifiers(s, 'itemEditView__section', {
                  hidden: true,
                })}>
                TODO
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

const useUpdateItem = () => {
  const { data: items, isFetched } = useItemsApi();
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const item = useMemo(() => items.find(i => i.id === id), [items, isFetched]);
  const [updatedItem, setUpdatedItem] = useState(item);

  const { mutate, isSuccess, isError, isPending } = useAdminUpdateItemApi();

  useEffect(() => {
    setUpdatedItem(item);
  }, [isFetched]);

  const itemImg = useMemo(
    () => updatedItem?.img.replace(CDN_URL, '') ?? '',
    [items],
  );

  const onSave = () => {
    if (updatedItem) mutate(updatedItem);
  };

  const onTextPropertyChange = (
    newValue: string,
    property: keyof Pick<TItem, 'name' | 'description' | 'obtainedAt' | 'img'>,
  ) => {
    if (!updatedItem) return;
    setUpdatedItem({
      ...updatedItem,
      [property]: newValue,
    });
  };

  const onNumberPropertyChange = (
    newValue: string,
    property: keyof Pick<TItem, 'price' | 'rarity'>,
  ) => {
    if (!updatedItem) return;
    setUpdatedItem({
      ...updatedItem,
      [property]: Number(newValue),
    });
  };

  const onBoolPropertyChange = (
    checked: boolean,
    property: keyof Pick<
      TItem,
      | 'purchasable'
      | 'consumable'
      | 'craftable'
      | 'equippable'
      | 'usable'
      | 'quickUse'
    >,
  ) => {
    if (!updatedItem) return;
    setUpdatedItem({
      ...updatedItem,
      [property]: checked,
    });
  };

  return {
    item,
    updatedItem,
    itemImg,
    onTextPropertyChange,
    onNumberPropertyChange,
    onBoolPropertyChange,
    onSave,
    isSuccess,
    isPending,
    isError,
  };
};
