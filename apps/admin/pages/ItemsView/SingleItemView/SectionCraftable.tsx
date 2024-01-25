import { v4 as uuid } from 'uuid';
import { FormControlLabel, Switch } from '@mui/material';
import {
  Button,
  Icon,
  Input,
  Select,
  modifiers,
  useItemsApi,
  useMaterialsApi,
} from '@mhgo/front';
import { CraftList, Item as TItem } from '@mhgo/types';

import s from './SingleItemView.module.scss';

type CraftableProps = {
  item?: TItem;
  setItem: (item: TItem) => void;
  itemCraft: CraftList[];
  setItemCraft: (itemCraft: CraftList[]) => void;
  itemId?: string;
};
export const SectionCraftable = ({
  item,
  setItem,
  itemCraft,
  setItemCraft,
  itemId,
}: CraftableProps) => {
  const { data: items } = useItemsApi(true);
  const { data: materials } = useMaterialsApi(true);

  const getSelect = (mat: CraftList) => {
    if (mat.craftType === 'item')
      return items.map(i => ({
        id: i.id,
        name: i.name,

        disabled: Boolean(
          // Dont allow to select item currently selected
          i.id === mat.id ||
            // Dont allow to select items which are already part of recipe
            itemCraft.find(entry => entry.id === i.id) ||
            // Dont allow to select item which you are editing atm
            i.id === itemId,
        ),
      }));

    if (mat.craftType === 'material')
      return materials.map(m => ({
        id: m.id,
        name: m.name,
        // Dont allow to select materials which are already part of recipe
        disabled: Boolean(
          m.id === mat.id || itemCraft.find(entry => entry.id === m.id),
        ),
      }));
    return [];
  };

  return (
    <div className={s.singleItemView__section}>
      <FormControlLabel
        label="Craftable?"
        control={
          <Switch
            color="default"
            checked={item?.craftable}
            onChange={(_, checked) =>
              item &&
              setItem({
                ...item,
                craftable: checked,
              })
            }
          />
        }
      />
      {item?.craftable ? (
        <div
          className={modifiers(s, 'singleItemView__section', {
            hidden: true,
            wide: false,
          })}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              label="Add item"
              onClick={() =>
                setItemCraft([
                  ...itemCraft,
                  {
                    // We fake this id because if we select first item from list
                    // it will duplicate if user creates more fields at once
                    // Having a fake ID set as date ensures their uniqueness
                    // Hacky and ugly I know. It's 2:26AM, I deserve some leniency
                    id: uuid(),
                    amount: 1,
                    craftType: 'item',
                  },
                ])
              }
            />
            <Button
              label="Add material"
              onClick={() =>
                setItemCraft([
                  ...itemCraft,
                  {
                    // As above
                    id: uuid(),
                    amount: 1,
                    craftType: 'material',
                  },
                ])
              }
            />
          </div>
          {itemCraft?.map((mat, index) => {
            const matSelection = getSelect(mat);
            return (
              <div
                className={s.singleItemView__craftMaterial}
                key={`craftmat-${index}`}>
                <div style={{ maxWidth: '200px', minWidth: '200px' }}>
                  <Select
                    defaultSelected={mat.id}
                    data={matSelection}
                    key={`select-${index}`}
                    name="Material"
                    setValue={selectedMatId => {
                      const updatedEntries = itemCraft.map(entry => {
                        if (entry.id === mat.id)
                          return { ...entry, id: selectedMatId };
                        return entry;
                      });
                      return setItemCraft(updatedEntries);
                    }}
                  />
                </div>
                <Input
                  name="craft_amount"
                  type="number"
                  value={String(mat.amount)}
                  min={1}
                  style={{ maxWidth: '75px' }}
                  setValue={selectedMatAmount => {
                    const updatedEntries = itemCraft.map(entry => {
                      if (entry.id === mat.id)
                        return {
                          ...entry,
                          amount: Number(selectedMatAmount),
                        };
                      return entry;
                    });
                    return setItemCraft(updatedEntries);
                  }}
                />
                <Button
                  label={<Icon icon="X" />}
                  onClick={() =>
                    setItemCraft(itemCraft.filter(entry => entry.id !== mat.id))
                  }
                  style={{ padding: 0 }}
                  simple
                  inverted
                  variant={Button.Variant.GHOST}
                />
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
