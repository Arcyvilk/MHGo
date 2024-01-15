import { useState } from 'react';
import { Instance } from 'tippy.js';
import { Material, Item as TItem } from '@mhgo/types';
import { Dropdown, Item } from '@mhgo/front';

import { ItemStats } from './ItemStats';

import s from './ItemContextMenu.module.scss';

export const ItemContextMenuSimple = ({
  item,
  material,
}: {
  item?: TItem;
  material?: Material;
}) => {
  const [_, setTippyInstance] = useState<Instance | null>(null);
  const entry = item ?? material;

  if (!entry) return null;
  return (
    <div className={s.itemContextMenu} key={entry.id}>
      <Dropdown
        setInstance={setTippyInstance}
        content={
          <div className={s.itemContextMenu__dropdown}>
            <div className={s.itemContextMenu__section}>
              <span style={{ fontWeight: 900 }}>{entry.name}</span>
              <span style={{ fontStyle: 'italic' }}>"{entry.description}"</span>
            </div>
            <div className={s.itemContextMenu__section}>
              <ItemStats itemId={entry.id} compare={false} />
            </div>
          </div>
        }>
        <Item data={{ ...entry, purchasable: false }} />
      </Dropdown>
    </div>
  );
};
