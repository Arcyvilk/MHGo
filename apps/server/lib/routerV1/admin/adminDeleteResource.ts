import { Request, Response } from 'express';
import { log } from '@mhgo/utils';

import { mongoInstance } from '../../../api';
import { Resource, ResourceDrop, ResourceMarker } from '@mhgo/types';

export const adminDeleteResource = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);

    const { resourceId } = req.params;

    if (!resourceId) throw new Error('Requested resource does not exist');

    // Delete basic resource info
    const collectionResources = db.collection<Resource>('resources');
    const responseResource = await collectionResources.deleteOne({
      id: resourceId,
    });
    if (!responseResource.acknowledged)
      throw new Error('Could not delete this resource.');

    // Delete all resource drops
    const collectionDrops = db.collection<ResourceDrop>('dropsResource');
    await collectionDrops.deleteMany({ resourceId });

    // Delete all resource markers
    const collectionMarkers = db.collection<ResourceMarker>('markersResource');
    await collectionMarkers.deleteMany({
      resourceId,
    });

    // Fin!
    res.sendStatus(200);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
