import { Request, Response } from 'express';
import { ObjectId, WithId } from 'mongodb';
import { log } from '@mhgo/utils';
import { MonsterMarker, ResourceMarker } from '@mhgo/types';

import { mongoInstance } from '../../../api';

// MONSTER MARKERS

export const adminUpdateMonsterMarker = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { markerId } = req.params;

    const collection = db.collection<MonsterMarker>('markersMonster');
    const { _id, ...updatedFields } = req.body as Partial<
      WithId<MonsterMarker>
    >;

    const response = await collection.updateOne(
      { _id: new ObjectId(markerId) },
      { $set: updatedFields },
      { upsert: true },
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

export const adminDeleteMonsterMarker = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { markerId } = req.params;

    const collection = db.collection<MonsterMarker>('markersMonster');

    const response = await collection.deleteOne({
      _id: new ObjectId(markerId),
    });

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not delete this monster marker.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

// RESOURCE MARKERS

export const adminUpdateResourceMarker = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { markerId } = req.params;

    const collection = db.collection<ResourceMarker>('markersResource');
    const { _id, ...updatedFields } = req.body as Partial<
      WithId<ResourceMarker>
    >;

    const response = await collection.updateOne(
      { _id: new ObjectId(markerId) },
      { $set: updatedFields },
      { upsert: true },
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update this resource marker.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

export const adminDeleteResourceMarker = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { markerId } = req.params;

    const collection = db.collection<ResourceMarker>('markersResource');

    const response = await collection.deleteOne({
      _id: new ObjectId(markerId),
    });

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not delete this resource marker.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
