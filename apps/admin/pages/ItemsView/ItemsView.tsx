import { useEffect, useMemo } from 'react';
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
  useContextualRouting,
  useItemsApi,
} from '@mhgo/front';

import { ActionBar, Table, TableHeader } from '../../containers';
import { useAppContext } from '../../utils/context';

import s from './ItemsView.module.scss';

const tableHeaders: TableHeader<TItem>[] = [
  { id: 'disabled', label: '' },
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
  { id: 'type', label: 'Type' },
  { id: 'rarity', label: 'Rarity' },
  { id: 'category', label: 'Category' },
  { id: 'purchasable', label: 'Purchasable' },
  { id: 'craftable', label: 'Craftable' },
  { id: 'usable', label: 'Usable' },
  { id: 'equippable', label: 'Equippable' },
  { id: 'consumable', label: 'Consumable' },
  { id: 'quickUse', label: 'Quick use' },
  { id: 'levelRequirement', label: 'LVL req.' },
  { id: 'actions', label: 'Actions' },
];

const itemFilters: ItemType[] = [
  'quest',
  'other',
  'weapon',
  'certificate',
  'armor',
];

export const ItemsView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const {
    orderItem: order,
    setOrderItem: setOrder,
    orderByItem: orderBy,
    setOrderByItem: setOrderBy,
  } = useAppContext();
  const navigate = useNavigate();
  const { data: items } = useItemsApi(true);
  const { mutate, isSuccess, isError } = useAdminUpdateItemApi();

  const { setRoute, route: filter } = useContextualRouting<string>({
    key: 'filter',
    value: itemFilters.join(','),
  });

  const setVisibleItems = (newFilters: ItemType[]) => {
    if (newFilters.length > 0) setRoute(newFilters.join(','));
    else setRoute('');
  };

  const filteredItems = useMemo(() => {
    const filtered = items
      .filter(item => filter.split(',').includes(item.type))
      .filter(Boolean) as TItem[];
    if (order && orderBy)
      return filtered.sort((a, b) =>
        order === 'asc'
          ? (a[orderBy] ?? 0) > (b[orderBy] ?? 0)
            ? 1
            : -1
          : (a[orderBy] ?? 0) < (b[orderBy] ?? 0)
            ? 1
            : -1,
      );
    else return filtered;
  }, [itemFilters, items, order, orderBy]);

  const onItemEdit = (item: TItem) => {
    navigate(`/items/edit?id=${item.id}`);
  };

  const onSwitch = (checked: boolean, item: TItem, property: keyof TItem) => {
    const updatedItem = {
      ...item,
      [property]: checked,
    };
    mutate(updatedItem);
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
    <Switch
      color="default"
      checked={!item.disabled}
      onChange={(_, checked) => onSwitch(!checked, item, 'disabled')}
    />,
    <ItemNameCell item={item} />,
    <Table.CustomCell content={item.description} />,
    item.type,
    item.rarity,
    item.category,
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
            {itemFilters.map(iType => {
              const currentFilter = filter.split(',') as ItemType[];
              return (
                <FormControlLabel
                  label={iType.toLocaleUpperCase()}
                  control={
                    <Switch
                      color="default"
                      checked={currentFilter.includes(iType)}
                      onChange={(_, checked) =>
                        checked
                          ? setVisibleItems([...currentFilter, iType])
                          : setVisibleItems(
                              currentFilter.filter(i => i !== iType),
                            )
                      }
                    />
                  }
                />
              );
            })}
            <Button
              label="Create new item"
              onClick={() => navigate('create')}
            />
          </>
        }
      />
      <div className={s.itemsView__content}>
        <Table
          tableHeaders={tableHeaders}
          items={tableRows}
          order={order}
          setOrder={setOrder}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
        />
      </div>
    </div>
  );
};

const ItemNameCell = ({ item }: { item: TItem }) => {
  return (
    <div className={s.itemsView__itemDetail}>
      <img src={item.img} className={s.itemsView__itemIcon} /> {item.name}
    </div>
  );
};
