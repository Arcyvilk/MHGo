import { FormControlLabel, Switch } from '@mui/material';
import { ItemAction, Item as TItem } from '@mhgo/types';
import { Input, Select, modifiers } from '@mhgo/front';

import s from './SingleItemView.module.scss';

type UsableProps = {
  updatedItem?: TItem;
  setUpdatedItem: (updatedItem: TItem) => void;
  updatedItemAction: ItemAction;
  setUpdatedItemAction: (updatedItemCraft: ItemAction) => void;
};
export const SectionUsable = ({
  updatedItem,
  setUpdatedItem,
  updatedItemAction,
  setUpdatedItemAction,
}: UsableProps) => {
  return (
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
                  key === 'heal' ? 0 : Object.values(updatedItemAction)?.[0],
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
  );
};
