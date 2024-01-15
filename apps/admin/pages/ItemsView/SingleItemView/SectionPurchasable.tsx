import { FormControlLabel, Switch } from '@mui/material';
import { Currency, Item as TItem, UserAmount } from '@mhgo/types';
import { Input, modifiers, useSettingsApi } from '@mhgo/front';

import s from './SingleItemView.module.scss';

type PurchasableProps = {
  item?: TItem;
  setItem: (item: TItem) => void;
  itemPrice: UserAmount[];
  setItemPrice: (itemPrice: UserAmount[]) => void;
};
export const SectionPurchasable = ({
  item,
  setItem,
  itemPrice,
  setItemPrice,
}: PurchasableProps) => {
  const { setting: currencies = [] as Currency[] } =
    useSettingsApi<Currency[]>('currency_types');

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
          {currencies.map(currency => {
            const value = itemPrice.find(price => price.id === currency.id);
            if (value === undefined) return null;
            return (
              <Input
                label={`Item price (${currency.id})`}
                name={`item_price_${currency.id}`}
                type="number"
                min={0}
                value={String(value.amount ?? 0)}
                setValue={amount => {
                  if (!item) return null;
                  const newItemPrice = itemPrice.map(p => {
                    if (p.id === currency.id) return { id: p.id, amount };
                    else return p;
                  });
                  return setItemPrice(newItemPrice as UserAmount[]);
                }}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
