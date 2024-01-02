import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControlLabel, Switch } from '@mui/material';
import { CDN_URL } from '@mhgo/front/env';
import { Item as TItem, ItemAction } from '@mhgo/types';
import {
  Button,
  Input,
  Item,
  Select,
  modifiers,
  useAdminUpdateItemApi,
  useItemActionsApi,
  useItemsApi,
} from '@mhgo/front';
import { ActionBar, HeaderEdit } from '../../../containers';

import s from './ItemEditView.module.scss';

export const ItemEditView = () => {
  const navigate = useNavigate();
  const {
    item,
    updatedItem,
    updatedItemAction,
    itemImg,
    onTextPropertyChange,
    onNumberPropertyChange,
    onBoolPropertyChange,
    onSelectionPropertyChange,
    onSave,
    isSuccess,
    isPending,
    isError,
  } = useUpdateItem();
  const status = { isSuccess, isPending, isError };

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
      <HeaderEdit status={status} title="Edit item" />
      <ActionBar
        title={`Item ID: ${updatedItem?.id}`}
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
      <div className={s.itemEditView__content}>
        <div className={s.itemEditView__content}>
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
          </div>
          <div
            className={s.itemEditView__section}
            style={{ alignItems: 'center' }}>
            <Input
              name="item_img"
              label="Path to item image"
              value={itemImg}
              setValue={newPath => onTextPropertyChange(newPath, 'img')}
            />
            <Item
              data={{
                ...(updatedItem ?? item),
                purchasable: false,
                img: `${CDN_URL}${itemImg}`,
              }}
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
                {/* TODO this sometimes does not update properly */}
                <Select
                  data={['img', 'text', 'heal', 'redirect'].map(item => ({
                    id: item,
                    name: item,
                  }))}
                  name="Action"
                  label="Action on use"
                  defaultSelected={Object.keys(updatedItemAction)?.[0]}
                  setValue={newAction =>
                    onSelectionPropertyChange(newAction as ItemAction)
                  }
                />
                <Input
                  name="item_action"
                  label="Action value"
                  value={String(Object.values(updatedItemAction)?.[0] ?? '')}
                  setValue={newActionValue =>
                    onSelectionPropertyChange(
                      Object.keys(updatedItemAction)?.[0] as ItemAction,
                      newActionValue,
                    )
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
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  const { data: items, isFetched: isItemFetched } = useItemsApi();
  const { data: itemAction, isFetched: isItemActionFetched } =
    useItemActionsApi(id!);

  const item = useMemo(
    () => items.find(i => i.id === id),
    [items, isItemFetched],
  );
  const [updatedItem, setUpdatedItem] = useState(item);
  const [updatedItemAction, setUpdatedItemAction] = useState<ItemAction>(
    itemAction ?? {},
  );

  useEffect(() => {
    setUpdatedItem(item);
  }, [isItemFetched]);
  useEffect(() => {
    console.log(itemAction);
    setUpdatedItemAction(itemAction ?? {});
  }, [isItemActionFetched]);

  const { mutate, isSuccess, isError, isPending } = useAdminUpdateItemApi();

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

  const onSelectionPropertyChange = (
    newKey: ItemAction,
    newValue?: string | number,
  ) => {
    if (!updatedItemAction) return;
    setUpdatedItemAction({
      ...updatedItemAction,
      [newKey as string]: newValue,
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
    itemImg,
    updatedItem,
    updatedItemAction,
    onTextPropertyChange,
    onNumberPropertyChange,
    onBoolPropertyChange,
    onSelectionPropertyChange,
    onSave,
    isSuccess,
    isPending,
    isError,
  };
};
