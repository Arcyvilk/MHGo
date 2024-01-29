import { Request, Response } from 'express';
import { ResourceMarker } from '@mhgo/types';
import { log } from '@mhgo/utils';

import { mongoInstance } from '../../../api';

export const getAllResourceMarkers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res.locals.adventure);

    const collectionResourceMarkers =
      db.collection<ResourceMarker>('markersResource');
    const resourceMarkers: ResourceMarker[] = await collectionResourceMarkers
      .find()
      .toArray();

    res.status(200).send(resourceMarkers);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
