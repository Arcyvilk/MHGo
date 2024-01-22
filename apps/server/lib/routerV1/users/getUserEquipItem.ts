import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Item, UserLoadout } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getUserEquipItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId, itemId } = req.params;
    const { action } = req.query;
    const { db } = mongoInstance.getDb();

    if (!action) throw new Error('Incorrect item action'!);

    // Get user's loadout
    const collectionUserLoadouts = db.collection<UserLoadout>('userLoadout');
    const { loadout } = await collectionUserLoadouts.findOne({ userId });

    // Get requested item
    const collectionItems = db.collection<Item>('items');
    const requestedItem = await collectionItems.findOne({ id: itemId });
    const itemSlot = requestedItem.slot;

    // Update user's loadout
    const newLoadout = [
      ...loadout.filter(slot => slot.slot !== itemSlot),
      ...(action === 'equip' ? [{ slot: itemSlot, itemId }] : []),
    ];

    const responseLoadoutUpdate = await collectionUserLoadouts.updateOne(
      { userId },
      {
        $set: {
          userId,
          loadout: newLoadout,
        },
      },
      { upsert: true },
    );

    if (!responseLoadoutUpdate.acknowledged) {
      res.status(400).send({ error: 'Could not equip this item.' });
    }

    // Correctly updated
    res.sendStatus(200);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
