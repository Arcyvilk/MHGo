import { FormControlLabel, Switch } from '@mui/material';
import { Item as TItem } from '@mhgo/types';
import { Input, modifiers } from '@mhgo/front';

import s from './SingleItemView.module.scss';

type PurchasableProps = {
  item?: TItem;
  setItem: (item: TItem) => void;
};
export const SectionPurchasable = ({ item, setItem }: PurchasableProps) => {
  return (
    <div className={s.singleItemView__section}>
      <FormControlLabel
        label="Purchasable?"
        control={
          <Switch
            color="default"
            checked={item?.purchasable}
            onChange={(_, checked) =>
              item &&
              setItem({
                ...item,
                purchasable: checked,
              })
            }
          />
        }
      />
      {item?.purchasable ? (
        <div
          className={modifiers(s, 'singleItemView__section', {
            hidden: true,
          })}>
          {/* 
            TODO
            Support multiple currencies!
           */}
          {/* <Input
            label="Item price"
            name="item_price"
            type="number"
            min={0}
            value={String(item?.price ?? 0)}
            setValue={price =>
              item &&
              setItem({
                ...item,
                // price: Number(price),
              })
            }
          /> */}
        </div>
      ) : null}
    </div>
  );
};
