import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { MonsterMarker } from '@mhgo/types';
import { log } from '@mhgo/utils';

import { mongoInstance } from '../../../api';

export const getSingleMonsterMarker = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { markerId } = req.params;

    console.log(markerId);
    if (!markerId) throw new Error('Monster marker ID missing!');

    const collectionMonsterMarkers =
      db.collection<MonsterMarker>('markersMonster');
    const monsterMarker = await collectionMonsterMarkers.findOne({
      _id: new ObjectId(markerId),
    });

    res.status(200).send(monsterMarker);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
