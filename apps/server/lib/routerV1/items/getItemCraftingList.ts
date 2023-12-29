import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import {
  Item,
  Material,
  UserAmount,
  UserItems,
  UserMaterials,
} from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getItemCraftingList = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { itemId, userId } = req.params;
    const { db } = mongoInstance.getDb();
    const collectionMaterials = db.collection<Material>('materials');

    // Get item that we want to craft
    const collectionItems = db.collection<Item>('items');
    const itemToCraft = await collectionItems.findOne({ id: itemId });

    // Get how many needed materials user has
    const collectionUserMaterials =
      db.collection<UserMaterials>('userMaterials');
    const userMaterials = (await collectionUserMaterials.findOne({ userId }))
      ?.materials;

    // Get materials that are needed to craft this item
    const materialCraftList = itemToCraft.craftList
      .filter(item => item.craftType === 'material')
      .map(material => ({ id: material.id, amount: material.amount }));
    const materialCraftIdsList = materialCraftList.map(m => m.id);
    const materialMatsCursor = collectionMaterials.find({
      id: { $in: materialCraftIdsList },
    });
    const materialMats = [];
    for await (const el of materialMatsCursor) {
      materialMats.push({
        id: el.id,
        amount: materialCraftList.find(m => m.id === el.id)?.amount ?? 0,
        userAmount: userMaterials.find(m => m.id === el.id)?.amount ?? 0,
      });
    }

    // Get how many needed items user has
    const collectionUserItems = db.collection<UserItems>('userItems');
    const userItems = (await collectionUserItems.findOne({ userId }))?.items;

    // Get items that are needed to craft this item
    const itemCraftList = itemToCraft.craftList
      .filter(item => item.craftType === 'item')
      .map(item => ({ id: item.id, amount: item.amount }));
    const itemCraftIdsList = itemCraftList.map(i => i.id);
    const itemMatsCursor = collectionItems.find({
      id: { $in: itemCraftIdsList },
    });
    const itemMats = [];
    for await (const el of itemMatsCursor) {
      itemMats.push({
        id: el.id,
        amount: itemCraftList.find(i => i.id === el.id)?.amount,
        userAmount: userItems.find(i => i.id === el.id)?.amount ?? 0,
      });
    }

    res.status(200).send([...itemMats, ...materialMats]);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
