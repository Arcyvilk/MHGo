import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import {
  CraftList,
  Item,
  ItemAction,
  ItemActions,
  ItemCraftList,
  ItemPrice,
  ItemStat,
  Stats,
  UserAmount,
} from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const adminCreateItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { item, itemAction, itemCraft, itemPrice, itemStats } = req.body as {
      item: Item;
      itemAction: ItemAction;
      itemCraft: CraftList[];
      itemPrice: UserAmount[];
      itemStats: Stats;
    };
    if (!item) throw new Error('Incorrect item!');

    // Check if the item with this ID already exists
    const newId = item.name.toLowerCase().replace(/ /g, '_');
    const collectionItems = db.collection<Item>('items');
    const itemWithSameId = await collectionItems.findOne({ id: newId });
    if (itemWithSameId) {
      throw new Error(
        'An item with this ID already exists! Please change the item name to generate new item ID.',
      );
    }

    // Create new item
    const responseCreateItem = await collectionItems.insertOne({
      ...item,
      id: newId,
      img: item.img.replace(process.env.CDN_URL, ''),
    });

    if (!responseCreateItem.acknowledged) {
      res.status(400).send({ error: 'Could not create this item.' });
      return;
    }

    // Get newly created item's ID
    const itemId = (
      await collectionItems.findOne({ _id: responseCreateItem.insertedId })
    )?.id;

    // Create item action
    const collectionItemActions = db.collection<ItemActions>('itemActions');
    await collectionItemActions.insertOne({
      itemId,
      action: itemAction,
    });

    // Create item craftlist
    const collectionItemCraftlist = db.collection<ItemCraftList>('itemCraft');
    await collectionItemCraftlist.insertOne({
      itemId,
      craftList: itemCraft,
    });

    // Create item stats
    const collectionItemStats = db.collection<ItemStat>('itemStats');
    await collectionItemStats.insertOne({
      itemId,
      stats: itemStats,
    });

    // Create item price
    const collectionItemPrice = db.collection<ItemPrice>('itemPrice');
    await collectionItemPrice.insertOne({
      itemId,
      price: itemPrice,
    });

    // Fin!
    res.sendStatus(201);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
