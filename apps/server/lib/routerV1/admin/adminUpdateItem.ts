import { Request, Response } from 'express';
import { WithId } from 'mongodb';
import { log } from '@mhgo/utils';
import {
  CraftList,
  Item,
  ItemAction,
  ItemCraftList,
  ItemStat,
  Material,
  Stats,
} from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const adminUpdateItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { itemId } = req.params;

    const collection = db.collection<Item>('items');
    const { _id, craftList, img, ...updatedFields } = req.body as Partial<
      WithId<Item>
    >;

    const response = await collection.updateOne(
      { id: itemId },
      {
        $set: {
          ...updatedFields,
          img: img.replace(process.env.CDN_URL, ''),
        },
      },
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update this item.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

export const adminUpdateItemAction = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { itemId } = req.params;

    const collection = db.collection<ItemAction>('itemActions');
    const action = req.body as ItemAction;

    const response = await collection.updateOne(
      { itemId },
      { $set: { action } },
      { upsert: true },
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update this item action.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

export const adminUpdateItemCrafts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { itemId } = req.params;

    const collection = db.collection<ItemCraftList>('itemCraft');
    const craftList = req.body as CraftList[];

    // Get all items
    const collectionItems = db.collection<Item>('items');
    const items: Item[] = [];
    const cursorItems = collectionItems.find({});
    for await (const el of cursorItems) {
      items.push(el);
    }

    // Get all materials
    const collectionMaterials = db.collection<Material>('materials');
    const materials: Material[] = [];
    const cursorMaterials = collectionMaterials.find({});
    for await (const el of cursorMaterials) {
      materials.push(el);
    }

    // Dont add as crafting ingredients items/materials that dont exist
    const itemIngredients = craftList.filter(
      entry => entry.craftType === 'item' && items.find(i => i.id === entry.id),
    );
    const materialIngredients = craftList.filter(
      entry =>
        entry.craftType === 'material' &&
        materials.find(i => i.id === entry.id),
    );

    const updatedCraftList = [...itemIngredients, ...materialIngredients];

    // Update crafting list
    const response = await collection.updateOne(
      { itemId },
      { $set: { craftList: updatedCraftList } },
      { upsert: true },
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update this item craft list.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

export const adminUpdateItemStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { itemId } = req.params;

    const collection = db.collection<ItemStat>('itemStats');
    const stats = req.body as Stats;
    const fixedStats = {
      ...stats,
      // TODO implement elements
      element: 'none',
    };

    const response = await collection.updateOne(
      { itemId },
      { $set: { stats: fixedStats } },
      { upsert: true },
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update this item stats.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
