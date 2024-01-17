import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { ItemType, Item as TItem } from '@mhgo/types';
import { CDN_URL } from '@mhgo/front/env';
import { Button, Input, Item, Select, useSettingsApi } from '@mhgo/front';
import { DEFAULT_ITEM_TYPES } from '../../../utils/defaults';

import s from './SingleItemView.module.scss';

type BasicProps = {
  item: TItem;
  setItem: (item: TItem) => void;
  itemImg: string;
  itemDrops?: { monsterId: string; level: number }[];
};
export const SectionBasic = ({
  item,
  setItem,
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
          value={item?.name ?? ''}
          setValue={name =>
            item &&
            setItem({
              ...item,
              name,
            })
          }
        />
        <Input
          name="item_desc"
          label="Item's description"
          value={item?.description ?? ''}
          setValue={description =>
            item &&
            setItem({
              ...item,
              description,
            })
          }
        />
        <Select
          label="Item's type"
          name="item_type"
          defaultSelected={item?.type}
          data={itemTypes!.map(type => ({ id: type, name: type }))}
          key={uuid()}
          setValue={type =>
            item &&
            setItem({
              ...item,
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
          value={String(item?.rarity ?? 1)}
          setValue={rarity =>
            item &&
            setItem({
              ...item,
              rarity: Number(rarity),
            })
          }
        />
        <Input
          name="item_requirement"
          label="Item's level requirement"
          min={0}
          type="number"
          value={String(item?.levelRequirement ?? 0)}
          setValue={levelRequirement =>
            item &&
            setItem({
              ...item,
              levelRequirement: Number(levelRequirement),
            })
          }
        />
        <Input
          name="item_category"
          label="Category of the item"
          value={item?.category ?? ''}
          setValue={category =>
            item &&
            setItem({
              ...item,
              category: category ?? '',
            })
          }
        />
        <Input
          name="item_obtainedAt"
          label="Where item can be obtained?"
          value={item?.obtainedAt ?? ''}
          setValue={obtainedAt =>
            item &&
            setItem({
              ...item,
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
            item &&
            setItem({
              ...item,
              img,
            })
          }
        />
        {item && (
          <Item
            data={{
              ...item,
              purchasable: false,
              img: `${CDN_URL}${itemImg}`,
            }}
          />
        )}
      </div>
      {itemDrops ? (
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
      ) : null}
    </div>
  );
};
