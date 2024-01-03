import { Request, Response } from 'express';
import { ResourceMarker } from '@mhgo/types';
import { log } from '@mhgo/utils';

import { mongoInstance } from '../../../api';

export const getAllResourceMarkers = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();

    const collectionResourceMarkers =
      db.collection<ResourceMarker>('markersResource');
    const resourceMarkers: ResourceMarker[] = [];

    const cursorResourceMarkers = collectionResourceMarkers.find({});

    for await (const el of cursorResourceMarkers) {
      resourceMarkers.push(el);
    }

    res.status(200).send(resourceMarkers);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
