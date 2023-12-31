import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Item } from '@mhgo/types';

import { mongoInstance } from '../../../api';
import {
  getItemsCraftList,
  getItemsPrices,
} from '../../helpers/getItemDetails';

export const getItems = async (_req: Request, res: Response): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();

    // Get all items
    const collectionItems = db.collection<Item>('items');
    const items: Item[] = [];
    const cursorItems = collectionItems.find().sort({ rarity: 'desc' });

    for await (const el of cursorItems) {
      items.push(el);
    }

    const itemIds = items.map(item => item.id);
    const craftLists = await getItemsCraftList(itemIds);
    const prices = await getItemsPrices(itemIds);

    const itemsWithCraft = items.map(item => {
      const craftList =
        craftLists.find(c => c.itemId === item.id)?.craftList ?? [];
      const price = prices.find(p => p.itemId === item.id)?.price ?? [];
      return {
        ...item,
        craftList,
        price,
      };
    });

    res.status(200).send(itemsWithCraft);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
