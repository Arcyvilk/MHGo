import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { ItemType, Item as TItem } from '@mhgo/types';
import { CDN_URL } from '@mhgo/front/env';
import { Button, Input, Item, Select, useSettingsApi } from '@mhgo/front';
import { DEFAULT_ITEM_TYPES } from '../../../utils/defaults';

import s from './SingleItemView.module.scss';

type BasicProps = {
  item: TItem;
  updatedItem?: TItem;
  setUpdatedItem: (updatedItem: TItem) => void;
  itemImg: string;
  itemDrops: { monsterId: string; level: number }[];
};
export const SectionBasic = ({
  item,
  updatedItem,
  setUpdatedItem,
  itemImg,
  itemDrops,
}: BasicProps) => {
  const navigate = useNavigate();
  const { setting: itemTypes } = useSettingsApi(
    'item_types',
    DEFAULT_ITEM_TYPES,
  );

  return (
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
        <Select
          label="Item's type"
          name="item_type"
          defaultSelected={updatedItem?.type}
          data={itemTypes!.map(type => ({ id: type, name: type }))}
          key={uuid()}
          setValue={type =>
            updatedItem &&
            setUpdatedItem({
              ...updatedItem,
              type: type as ItemType,
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
          <p style={{ fontWeight: 600 }} className={s.singleItemView__withInfo}>
            Dropped by:
          </p>
          {itemDrops.length > 0
            ? itemDrops.map(drop => (
                <Button
                  key={`monsterlink-${drop.monsterId}`}
                  variant={Button.Variant.GHOST}
                  inverted
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
  );
};
