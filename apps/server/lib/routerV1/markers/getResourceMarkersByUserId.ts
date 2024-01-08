import { Request, Response } from 'express';
import { ResourceMarker, UserRespawn } from '@mhgo/types';
import { log } from '@mhgo/utils';

import { mongoInstance } from '../../../api';
import { ObjectId } from 'mongodb';

export const getResourceMarkersByUserId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // lat and lng are optional!
    const { userId } = req.params;
    const { lat, lng } = req.query;

    const { db } = mongoInstance.getDb();

    // Show only markers within some set distance
    const fixedLat = lat !== undefined ? Number(Number(lat).toFixed(2)) : null;
    const fixedLng = lng !== undefined ? Number(Number(lng).toFixed(2)) : null;

    const filterCoords =
      fixedLat !== null && fixedLng !== null
        ? {
            'coords.0': {
              $lt: fixedLat + 0.01,
              $gt: fixedLat - 0.01,
            },
            'coords.1': {
              $lt: fixedLng + 0.01,
              $gt: fixedLng - 0.01,
            },
          }
        : {};

    // Filter out resources that are still respawning
    const collectionUserRespawn = db.collection<UserRespawn>('userRespawn');
    const filterCooldown: { _id: ObjectId }[] = [];
    const cursorUserRespawn = collectionUserRespawn.find({ userId });
    for await (const el of cursorUserRespawn) {
      if (el.markerType == 'resource')
        filterCooldown.push({ _id: new ObjectId(el.markerId) });
    }

    // Apply all filters and get all visible markers
    const collectionResourceMarkers =
      db.collection<ResourceMarker>('markersResource');
    const resourceMarkers: ResourceMarker[] = [];

    // Aggregate all filters together
    const norFilters = [...filterCooldown];

    const cursorResourceMarkers = collectionResourceMarkers.find({
      ...filterCoords,
      ...(norFilters.length ? { $nor: norFilters } : {}),
    });

    for await (const el of cursorResourceMarkers) {
      resourceMarkers.push({
        ...el,
        id: String(el._id),
      });
    }

    res.status(200).send(resourceMarkers);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
