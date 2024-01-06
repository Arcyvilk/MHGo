import { FormControlLabel, Switch } from '@mui/material';
import { ItemAction, Item as TItem } from '@mhgo/types';
import { Input, Select, modifiers } from '@mhgo/front';

import s from './SingleItemView.module.scss';

type UsableProps = {
  item?: TItem;
  setItem: (item: TItem) => void;
  itemAction: ItemAction;
  setItemAction: (itemCraft: ItemAction) => void;
};
export const SectionUsable = ({
  item,
  setItem,
  itemAction,
  setItemAction,
}: UsableProps) => {
  return (
    <div className={s.singleItemView__section}>
      <FormControlLabel
        label="Usable?"
        control={
          <Switch
            color="default"
            checked={item?.usable}
            onChange={(_, checked) =>
              item &&
              setItem({
                ...item,
                usable: checked,
              })
            }
          />
        }
      />
      {item?.usable ? (
        <div
          className={modifiers(s, 'singleItemView__section', {
            hidden: true,
          })}>
          <FormControlLabel
            label="Consumed on use?"
            control={
              <Switch
                color="default"
                checked={item?.consumable}
                onChange={(_, checked) =>
                  item &&
                  setItem({
                    ...item,
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
                checked={item?.quickUse}
                onChange={(_, checked) =>
                  item &&
                  setItem({
                    ...item,
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
            defaultSelected={Object.keys(itemAction)?.[0]}
            setValue={key =>
              setItemAction({
                [key]: key === 'heal' ? 0 : Object.values(itemAction)?.[0],
              })
            }
          />
          <Input
            name="item_action"
            label="Action value"
            min={0}
            value={String(Object.values(itemAction)?.[0] ?? '')}
            setValue={value =>
              setItemAction({
                ...itemAction,
                [Object.keys(itemAction)?.[0]]: Number(value)
                  ? Number(value)
                  : value,
              })
            }
          />
        </div>
      ) : null}
    </div>
  );
};
