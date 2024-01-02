import { Request, Response } from 'express';
import { ObjectId, WithId } from 'mongodb';
import { log } from '@mhgo/utils';
import { MonsterMarker } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const adminUpdateMonsterMarker = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { id } = req.params;

    const collection = db.collection<MonsterMarker>('monsterMarkers');
    const { _id, ...updatedFields } = req.body as Partial<
      WithId<MonsterMarker>
    >;

    const response = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: updatedFields },
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update this monster marker.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
