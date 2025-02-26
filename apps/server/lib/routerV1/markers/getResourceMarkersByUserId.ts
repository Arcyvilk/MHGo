import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import {
  Resource,
  ResourceMarker,
  Setting,
  UserGameData,
  UserRespawn,
} from '@mhgo/types';
import { log } from '@mhgo/utils';

import { mongoInstance } from '../../../api';
import { getUserLevel } from '../../helpers/getUserLevel';

export const getResourceMarkersByUserId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // lat and lng are optional!
    const { userId } = req.params;
    const { lat, lng } = req.query;

    const { db } = mongoInstance.getDb(res?.locals?.adventure);

    // Get the maximum level of resource that can spawn on random level spawns
    const collectionUsers = db.collection<UserGameData>('users');
    const collectionSettings = db.collection<Setting<number>>('settings');
    const user = await collectionUsers.findOne({ id: userId });
    const expPerLevel =
      (await collectionSettings.findOne({ key: 'exp_per_level' }))?.value ??
      100;
    const userLevel = getUserLevel(user, expPerLevel);
    const maxResourceLevel = userLevel;

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

    // Show only markers with no level or level lower than user's level
    const filterLevel = [
      { level: null },
      { level: { $lte: maxResourceLevel } },
    ];

    // Filter out resources that have level requirements higher than user's level
    // and ones that are disabled
    const collectionResources = db.collection<Resource>('resources');
    const filterTooHighLevelRequirement: { resourceId: string }[] = [];
    const cursorDisabledResources = collectionResources.find({
      $or: [{ levelRequirements: { $gt: userLevel } }, { disabled: true }],
    });
    for await (const el of cursorDisabledResources) {
      filterTooHighLevelRequirement.push({ resourceId: el.id });
    }

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
    const orFilters = [...filterLevel];
    const norFilters = [...filterCooldown, ...filterTooHighLevelRequirement];

    const cursorResourceMarkers = collectionResourceMarkers.find({
      ...filterCoords,
      ...(orFilters.length ? { $or: orFilters } : {}),
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
