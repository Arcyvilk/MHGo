import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { MonsterMarker, ResourceMarker } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const adminCreateMonsterMarker = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);

    const collection = db.collection<MonsterMarker>('markersMonster');
    const monsterMarker = req.body as MonsterMarker;

    const response = await collection.insertOne(monsterMarker);

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not create this monster marker.' });
    } else {
      res.status(201).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

export const adminCreateResourceMarker = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);

    const collection = db.collection<ResourceMarker>('markersResource');
    const resourceMarker = req.body as ResourceMarker;

    const response = await collection.insertOne(resourceMarker);

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not create this resource marker.' });
    } else {
      res.status(201).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
