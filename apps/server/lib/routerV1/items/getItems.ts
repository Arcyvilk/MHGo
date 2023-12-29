import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Item } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getItems = async (_req: Request, res: Response): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();

    // Get all items
    const collectionItems = db.collection<Item>('items');
    const items: Item[] = [];
    const cursorItems = collectionItems.find();
    for await (const el of cursorItems) {
      items.push(el);
    }

    res.status(200).send(items);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
