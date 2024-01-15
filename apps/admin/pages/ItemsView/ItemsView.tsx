import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FormControlLabel, Switch } from '@mui/material';
import { ItemType, Item as TItem } from '@mhgo/types';
import {
  Button,
  Icon,
  Loader,
  QueryBoundary,
  Size,
  useAdminUpdateItemApi,
  useItemsApi,
} from '@mhgo/front';

import { ActionBar, Table } from '../../containers';

import s from './ItemsView.module.scss';

const tableHeaders = [
  'Name',
  'Type',
  'Rarity',
  'Purchasable?',
  'Craftable?',
  'Usable?',
  'Equippable?',
  'Consumable?',
  'Quick use?',
  'Level requirement',
  'Actions',
];

export const ItemsView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const navigate = useNavigate();
  const { data: items } = useItemsApi();
  const { mutate, isSuccess, isError } = useAdminUpdateItemApi();
  const [itemFilters, setItemFilters] = useState<ItemType[]>([
    'quest',
    'other',
    'weapon',
    'armor',
  ]);

  const filteredItems = useMemo(() => {
    return items.filter(item => itemFilters.includes(item.type));
  }, [itemFilters, items]);

  const onSwitch = (checked: boolean, item: TItem, property: keyof TItem) => {
    const updatedItem = {
      ...item,
      [property]: checked,
    };
    mutate(updatedItem);
  };

  const onItemEdit = (item: TItem) => {
    navigate(`/items/edit?id=${item.id}`);
  };

  // TODO Make those two into a hook
  // and don't display a toast, show "Saving..." and "Saved!" in the header instead
  useEffect(() => {
    if (isSuccess) toast.success('Item saved successfully!');
  }, [isSuccess]);

  useEffect(() => {
    if (isError) toast.error('Could not save the item :c');
  }, [isError]);

  const tableRows = filteredItems.map(item => [
    <ItemCell item={item} />,
    item.type,
    item.rarity,
    <Switch
      color="default"
      checked={item.purchasable}
      onChange={(_, checked) => onSwitch(checked, item, 'purchasable')}
    />,
    <Switch
      color="default"
      checked={item.craftable}
      onChange={(_, checked) => onSwitch(checked, item, 'craftable')}
    />,
    <Switch
      color="default"
      checked={item.usable}
      onChange={(_, checked) => onSwitch(checked, item, 'usable')}
    />,
    <Switch
      color="default"
      checked={item.equippable}
      onChange={(_, checked) => onSwitch(checked, item, 'equippable')}
    />,
    <Switch
      color="default"
      checked={item.consumable}
      onChange={(_, checked) => onSwitch(checked, item, 'consumable')}
    />,
    <Switch
      color="default"
      checked={item.quickUse}
      onChange={(_, checked) => onSwitch(checked, item, 'quickUse')}
    />,
    item.levelRequirement,
    <Button
      label={<Icon icon="Edit" size={Size.MICRO} />}
      onClick={() => onItemEdit(item)}
      style={{ width: '40px' }}
    />,
  ]);

  return (
    <div className={s.itemsView}>
      <div className={s.itemsView__header}>
        <h1 className={s.itemsView__title}>ITEMS</h1>
      </div>
      <ActionBar
        buttons={
          <>
            {(['weapon', 'armor', 'quest', 'other'] as ItemType[]).map(
              iType => (
                <FormControlLabel
                  label={iType.toLocaleUpperCase()}
                  control={
                    <Switch
                      color="default"
                      checked={itemFilters.includes(iType)}
                      onChange={(_, checked) =>
                        checked
                          ? setItemFilters([...itemFilters, iType])
                          : setItemFilters(itemFilters.filter(i => i !== iType))
                      }
                    />
                  }
                />
              ),
            )}
            <Button
              label="Create new item"
              onClick={() => navigate('create')}
            />
          </>
        }
      />
      <div className={s.itemsView__content}>
        <Table tableHeaders={tableHeaders} items={tableRows} />
      </div>
    </div>
  );
};

const ItemCell = ({ item }: { item: TItem }) => {
  return (
    <div className={s.itemsView__itemDetail}>
      <img src={item.img} className={s.itemsView__itemIcon} /> {item.name}
    </div>
  );
};
