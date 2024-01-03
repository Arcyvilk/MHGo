import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControlLabel, Switch } from '@mui/material';
import { CDN_URL } from '@mhgo/front/env';
import {
  Button,
  Icon,
  Input,
  Item,
  Select,
  modifiers,
  useAdminUpdateItemActionApi,
  useAdminUpdateItemApi,
  useAdminUpdateItemCraftlistApi,
  useItemActionsApi,
  useItemCraftsApi,
  useItemsApi,
  useMaterialsApi,
  useMonsterDropsApi,
} from '@mhgo/front';
import { ActionBar, HeaderEdit } from '../../../containers';

import s from './SingleItemView.module.scss';
import { CraftList } from '@mhgo/types';

export const ItemEditView = () => {
  const navigate = useNavigate();
  const {
    item,
    updatedItem,
    updatedItemAction,
    updatedItemCraft,
    itemImg,
    itemDrops,
    setUpdatedItem,
    setUpdatedItemAction,
    setUpdatedItemCraft,
    onSave,
    isSuccess,
    isPending,
    isError,
  } = useUpdateItem();
  const status = { isSuccess, isPending, isError };

  const { data: items } = useItemsApi();
  const { data: materials } = useMaterialsApi();

  const getSelect = (mat: CraftList) => {
    if (mat.craftType === 'item')
      return items.map(i => ({
        id: i.id,
        name: i.name,

        disabled: Boolean(
          // Dont allow to select item currently selected
          i.id === mat.id ||
            // Dont allow to select items which are already part of recipe
            updatedItemCraft.find(entry => entry.id === i.id) ||
            // Dont allow to select item which you are editing atm
            i.id === item?.id,
        ),
      }));

    if (mat.craftType === 'material')
      return materials.map(m => ({
        id: m.id,
        name: m.name,
        // Dont allow to select materials which are already part of recipe
        disabled: Boolean(
          m.id === mat.id || updatedItemCraft.find(entry => entry.id === m.id),
        ),
      }));
    return [];
  };

  if (!item)
    return (
      <div className={s.singleItemView}>
        <div className={s.singleItemView__header}>
          <h1 className={s.singleItemView__title}>This item does not exist</h1>
        </div>
        <div className={s.singleItemView__footer}>
          <Button label="Back" onClick={() => navigate(-1)} />
        </div>
      </div>
    );

  return (
    <div className={s.singleItemView}>
      <HeaderEdit status={status} title="Edit item" />
      <ActionBar
        title={`Item ID: ${updatedItem?.id}`}
        buttons={
          <>
            <Button
              label="Cancel"
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
      <div className={s.singleItemView__content}>
        <div className={s.singleItemView__content}>
          <div className={s.singleItemView__section}>
            <Input
              name="item_name"
              label="Item's name"
              value={updatedItem?.name ?? ''}
              setValue={name =>
                updatedItem &&
                setUpdatedItem({
                  ...updatedItem,
                  name,
                })
              }
            />
            <Input
              name="item_desc"
              label="Item's description"
              value={updatedItem?.description ?? ''}
              setValue={description =>
                updatedItem &&
                setUpdatedItem({
                  ...updatedItem,
                  description,
                })
              }
            />
            <Input
              name="item_obtainedAt"
              label="Where item can be obtained?"
              value={updatedItem?.obtainedAt ?? ''}
              setValue={obtainedAt =>
                updatedItem &&
                setUpdatedItem({
                  ...updatedItem,
                  obtainedAt,
                })
              }
            />
            <Input
              name="item_rarity"
              label="Item's rarity"
              min={1}
              max={5}
              type="number"
              value={String(updatedItem?.rarity ?? 1)}
              setValue={rarity =>
                updatedItem &&
                setUpdatedItem({
                  ...updatedItem,
                  rarity: Number(rarity),
                })
              }
            />
          </div>
          <div
            className={s.singleItemView__section}
            style={{ alignItems: 'center' }}>
            <Input
              name="item_img"
              label="Path to item image"
              value={itemImg}
              setValue={img =>
                updatedItem &&
                setUpdatedItem({
                  ...updatedItem,
                  img,
                })
              }
            />
            <Item
              data={{
                ...(updatedItem ?? item),
                purchasable: false,
                img: `${CDN_URL}${itemImg}`,
              }}
            />
          </div>
          <div className={s.singleItemView__section}>
            <div className={s.singleItemView__infoSection}>
              <p
                style={{ fontWeight: 600 }}
                className={s.singleItemView__withInfo}>
                Dropped by:
              </p>
              {itemDrops.length > 0
                ? itemDrops.map(drop => (
                    <Button
                      key={`monsterlink-${drop.monsterId}`}
                      variant={Button.Variant.GHOST}
                      simple
                      label={`${drop.monsterId} (level ${drop.level})`}
                      onClick={() =>
                        navigate(`/monsters/edit?id=${drop.monsterId}`)
                      }
                    />
                  ))
                : '-'}
            </div>
          </div>
        </div>
        <div className={s.singleItemView__content}>
          {/* 
              PURCHASABLE ITEM SECTION 
          */}
          <div className={s.singleItemView__section}>
            <FormControlLabel
              label="Purchasable?"
              control={
                <Switch
                  color="default"
                  checked={updatedItem?.purchasable}
                  onChange={(_, checked) =>
                    updatedItem &&
                    setUpdatedItem({
                      ...updatedItem,
                      purchasable: checked,
                    })
                  }
                />
              }
            />
            {updatedItem?.purchasable ? (
              <div
                className={modifiers(s, 'singleItemView__section', {
                  hidden: true,
                })}>
                <Input
                  label="Item price"
                  name="item_price"
                  type="number"
                  min={0}
                  value={String(updatedItem?.price ?? 0)}
                  setValue={price =>
                    updatedItem &&
                    setUpdatedItem({
                      ...updatedItem,
                      price: Number(price),
                    })
                  }
                />
              </div>
            ) : null}
          </div>
          {/* 
              USABLE ITEM SECTION 
            */}
          <div className={s.singleItemView__section}>
            <FormControlLabel
              label="Usable?"
              control={
                <Switch
                  color="default"
                  checked={updatedItem?.usable}
                  onChange={(_, checked) =>
                    updatedItem &&
                    setUpdatedItem({
                      ...updatedItem,
                      usable: checked,
                    })
                  }
                />
              }
            />
            {updatedItem?.usable ? (
              <div
                className={modifiers(s, 'singleItemView__section', {
                  hidden: true,
                })}>
                <FormControlLabel
                  label="Consumed on use?"
                  control={
                    <Switch
                      color="default"
                      checked={updatedItem?.consumable}
                      onChange={(_, checked) =>
                        updatedItem &&
                        setUpdatedItem({
                          ...updatedItem,
                          consumable: checked,
                        })
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
                        updatedItem &&
                        setUpdatedItem({
                          ...updatedItem,
                          quickUse: checked,
                        })
                      }
                    />
                  }
                />
                <Select
                  data={['img', 'text', 'heal', 'redirect'].map(item => ({
                    id: item,
                    name: item,
                  }))}
                  name="Action"
                  label="Action on use"
                  defaultSelected={Object.keys(updatedItemAction)?.[0]}
                  setValue={key =>
                    setUpdatedItemAction({
                      [key]:
                        key === 'heal'
                          ? 0
                          : Object.values(updatedItemAction)?.[0],
                    })
                  }
                />
                <Input
                  name="item_action"
                  label="Action value"
                  min={0}
                  value={String(Object.values(updatedItemAction)?.[0] ?? '')}
                  setValue={value =>
                    setUpdatedItemAction({
                      ...updatedItemAction,
                      [Object.keys(updatedItemAction)?.[0]]: Number(value)
                        ? Number(value)
                        : value,
                    })
                  }
                />
              </div>
            ) : null}
          </div>
          {/* 
              EQUIPPABLE ITEM SECTION 
          */}
          <div className={s.singleItemView__section}>
            <FormControlLabel
              label="Equippable?"
              control={
                <Switch
                  color="default"
                  checked={updatedItem?.equippable}
                  onChange={(_, checked) =>
                    updatedItem &&
                    setUpdatedItem({
                      ...updatedItem,
                      equippable: checked,
                    })
                  }
                />
              }
            />
            {updatedItem?.equippable ? (
              <div
                className={modifiers(s, 'singleItemView__section', {
                  hidden: true,
                })}>
                TODO
              </div>
            ) : null}
          </div>
          {/* 
              CRAFTABLE ITEM SECTION 
          */}
          <div className={s.singleItemView__section}>
            <FormControlLabel
              label="Craftable?"
              control={
                <Switch
                  color="default"
                  checked={updatedItem?.craftable}
                  onChange={(_, checked) =>
                    updatedItem &&
                    setUpdatedItem({
                      ...updatedItem,
                      craftable: checked,
                    })
                  }
                />
              }
            />
            {updatedItem?.craftable ? (
              <div
                className={modifiers(s, 'singleItemView__section', {
                  hidden: true,
                  wide: true,
                })}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    label="Add item"
                    onClick={() =>
                      setUpdatedItemCraft([
                        ...updatedItemCraft,
                        {
                          // We fake this id because if we select first item from list
                          // it will duplicate if user creates more fields at once
                          // Having a fake ID set as date ensures their uniqueness
                          // Hacky and ugly I know. It's 2:26AM, I deserve some leniency
                          id: new Date().valueOf().toString(),
                          amount: 1,
                          craftType: 'item',
                        },
                      ])
                    }
                  />
                  <Button
                    label="Add material"
                    onClick={() =>
                      setUpdatedItemCraft([
                        ...updatedItemCraft,
                        {
                          // As above
                          id: new Date().valueOf().toString(),
                          amount: 1,
                          craftType: 'material',
                        },
                      ])
                    }
                  />
                </div>
                {updatedItemCraft?.map((mat, index) => {
                  const matSelection = getSelect(mat);
                  console.log(mat);
                  return (
                    <div
                      className={s.singleItemView__craftMaterial}
                      key={`craftmat-${index}`}>
                      <div style={{ maxWidth: '200px', minWidth: '200px' }}>
                        <Select
                          defaultSelected={mat.id}
                          data={matSelection}
                          key={`select-${index}`}
                          name="Material"
                          setValue={selectedMatId => {
                            const updatedEntries = updatedItemCraft.map(
                              entry => {
                                if (entry.id === mat.id)
                                  return { ...entry, id: selectedMatId };
                                return entry;
                              },
                            );
                            return setUpdatedItemCraft(updatedEntries);
                          }}
                        />
                      </div>
                      <Input
                        name="craft_amount"
                        type="number"
                        value={String(mat.amount)}
                        min={1}
                        style={{ maxWidth: '75px' }}
                        setValue={selectedMatAmount => {
                          const updatedEntries = updatedItemCraft.map(entry => {
                            if (entry.id === mat.id)
                              return {
                                ...entry,
                                amount: Number(selectedMatAmount),
                              };
                            return entry;
                          });
                          return setUpdatedItemCraft(updatedEntries);
                        }}
                      />
                      <Button
                        label={<Icon icon="X" />}
                        onClick={() =>
                          setUpdatedItemCraft(
                            updatedItemCraft.filter(
                              entry => entry.id !== mat.id,
                            ),
                          )
                        }
                        style={{ padding: 0 }}
                        simple
                        variant={Button.Variant.GHOST}
                      />
                    </div>
                  );
                })}
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

  /**
   * ITEM API
   */
  const { data: items, isFetched: isItemFetched } = useItemsApi();
  const {
    mutate: mutateItem,
    isSuccess: isUpdateItemSuccess,
    isError: isUpdateItemError,
    isPending: isUpdateItemPending,
  } = useAdminUpdateItemApi();

  const item = useMemo(
    () => items.find(i => i.id === id),
    [items, isItemFetched],
  );

  const [updatedItem, setUpdatedItem] = useState(item);

  useEffect(() => {
    setUpdatedItem(item);
  }, [isItemFetched]);

  /**
   * ITEM ACTION API
   */
  const { data: itemAction = {}, isFetched: isItemActionFetched } =
    useItemActionsApi(id!);
  const [updatedItemAction, setUpdatedItemAction] = useState(itemAction);
  const {
    mutate: mutateItemAction,
    isSuccess: isUpdateActionSuccess,
    isError: isUpdateActionError,
    isPending: isUpdateActionPending,
  } = useAdminUpdateItemActionApi();

  useEffect(() => {
    setUpdatedItemAction(itemAction);
  }, [isItemActionFetched]);

  /**
   * ITEM CRAFT API
   */
  const { data: itemCraft = [], isFetched: isCraftFetched } =
    useItemCraftsApi(id);
  const [updatedItemCraft, setUpdatedItemCraft] = useState(itemCraft);
  const {
    mutate: mutateItemCraft,
    isSuccess: isUpdateCraftSuccess,
    isError: isUpdateCraftError,
    isPending: isUpdateCraftPending,
  } = useAdminUpdateItemCraftlistApi();

  useEffect(() => {
    setUpdatedItemCraft(itemCraft);
  }, [isCraftFetched]);

  /**
   * ITEM DROPS API
   */
  const { data: drops, isFetched: isDropsFetched } = useMonsterDropsApi();
  const itemDrops = useMemo(() => {
    const monsters: { monsterId: string; level: number }[] = [];
    drops.forEach(drop =>
      drop.drops.map(levelDrop => {
        if (levelDrop.drops.some(d => d.id === item?.id))
          monsters.push({ monsterId: drop.monsterId, level: levelDrop.level });
      }),
    );
    return monsters;
  }, [drops, isDropsFetched]);

  const itemImg = useMemo(
    () => updatedItem?.img.replace(CDN_URL, '') ?? '',
    [items],
  );

  const onSave = () => {
    if (updatedItem) mutateItem({ ...updatedItem, img: itemImg });
    if (updatedItemAction)
      mutateItemAction({ itemId: item!.id, ...updatedItemAction });
    if (updatedItemCraft) {
      mutateItemCraft({ itemId: item!.id, craftList: updatedItemCraft });
    }
  };

  return {
    item,
    itemImg,
    updatedItem,
    updatedItemAction,
    updatedItemCraft,
    itemDrops,
    setUpdatedItem,
    setUpdatedItemAction,
    setUpdatedItemCraft,
    onSave,
    isSuccess:
      isUpdateActionSuccess && isUpdateItemSuccess && isUpdateCraftSuccess,
    isPending:
      isUpdateActionPending || isUpdateItemPending || isUpdateCraftPending,
    isError: isUpdateActionError || isUpdateItemError || isUpdateCraftError,
  };
};
