import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { ItemPrice } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getItemPrice = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { itemId } = req.params;

    const { db } = mongoInstance.getDb(res.locals.adventure);
    const collection = db.collection<ItemPrice>('itemPrice');
    const item = await collection.findOne({ itemId });

    res.status(200).send(item?.price ?? []);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
