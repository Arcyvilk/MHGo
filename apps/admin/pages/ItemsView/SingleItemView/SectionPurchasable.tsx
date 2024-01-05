import { FormControlLabel, Switch } from '@mui/material';
import { Item as TItem } from '@mhgo/types';
import { Input, modifiers } from '@mhgo/front';

import s from './SingleItemView.module.scss';

type PurchasableProps = {
  updatedItem?: TItem;
  setUpdatedItem: (updatedItem: TItem) => void;
};
export const SectionPurchasable = ({
  updatedItem,
  setUpdatedItem,
}: PurchasableProps) => {
  return (
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
  );
};
