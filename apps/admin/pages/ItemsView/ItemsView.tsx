import { Item as TItem } from '@mhgo/types';
import { useItemsApi } from '@mhgo/front';
import { Table } from '../../containers';

import s from './ItemsView.module.scss';

export const ItemsView = () => {
  const { data: items } = useItemsApi();

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
  ];

  const tableRows = items.map(item => [
    <ItemCell item={item} />,
    item.type,
    item.rarity,
    String(item.purchasable),
    String(item.craftable),
    String(item.usable),
    String(item.equippable),
    String(item.consumable),
    String(item.quickUse),
  ]);

  return (
    <div className={s.itemsView}>
      <div className={s.itemsView__header}>
        <h1 className={s.itemsView__title}>ITEMS</h1>
      </div>
      <Table tableHeaders={tableHeaders} items={tableRows} />
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
