import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { ResourceMarker } from '@mhgo/types';
import { log } from '@mhgo/utils';

import { mongoInstance } from '../../../api';

export const getSingleResourceMarker = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);
    const { markerId } = req.params;

    if (!markerId) throw new Error('Resource marker ID missing!');

    const collectionResourceMarkers =
      db.collection<ResourceMarker>('markersResource');
    const resourceMarker = await collectionResourceMarkers.findOne({
      _id: new ObjectId(markerId),
    });

    res.status(200).send(resourceMarker);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
