import { Request, Response } from 'express';
import { MonsterMarker } from '@mhgo/types';
import { log } from '@mhgo/utils';

import { mongoInstance } from '../../../api';

export const getAllMonsterMarkers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res.locals.adventure);

    const collectionMonsterMarkers =
      db.collection<MonsterMarker>('markersMonster');;
    const monsterMarkers: MonsterMarker[] = [];

    const cursorMonsterMarkers = collectionMonsterMarkers.find({});

    for await (const el of cursorMonsterMarkers) {
      monsterMarkers.push(el);
    }

    res.status(200).send(monsterMarkers);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
