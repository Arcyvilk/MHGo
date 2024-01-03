import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { ItemCraftList } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getItemCrafts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { itemId } = req.params;

    const { db } = mongoInstance.getDb();
    const collection = db.collection<ItemCraftList>('itemCraft');
    const item = await collection.findOne({ itemId });

    res.status(200).send(item?.craftList ?? null);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
