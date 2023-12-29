import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { ItemActions } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getItemActions = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { itemId } = req.params;

    const { db } = mongoInstance.getDb();
    const collectionItemUses = db.collection<ItemActions>('itemActions');
    const itemUse = await collectionItemUses.findOne({ itemId });

    res.status(200).send(itemUse?.action ?? null);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
