import { ItemCraftList, ItemPrice } from '@mhgo/types';

import { mongoInstance } from '../../api';

export const getItemsCraftList = async (itemIds: string[]) => {
  const { db } = mongoInstance.getDb();
  const collectionItemCraft = db.collection<ItemCraftList>('itemCraft');

  const craftLists: ItemCraftList[] = [];
  const cursorCraftLists = collectionItemCraft.find({
    itemId: { $in: itemIds },
  });

  for await (const el of cursorCraftLists) {
    craftLists.push(el);
  }

  return craftLists;
};

export const getItemsPrices = async (itemIds: string[]) => {
  const { db } = mongoInstance.getDb();
  const collectionItemPrices = db.collection<ItemPrice>('itemPrice');

  const itemsPrices: ItemPrice[] = [];
  const cursorItemPrices = collectionItemPrices.find({
    itemId: { $in: itemIds },
  });

  for await (const el of cursorItemPrices) {
    itemsPrices.push(el);
  }

  return itemsPrices;
};
