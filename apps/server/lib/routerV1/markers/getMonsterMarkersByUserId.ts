import { Request, Response } from 'express';
import {
  Monster,
  MonsterMarker,
  Setting,
  User,
  UserRespawn,
} from '@mhgo/types';
import { log } from '@mhgo/utils';

import { mongoInstance } from '../../../api';
import {
  determineMonsterLevel,
  getUserLevel,
} from '../../helpers/getUserLevel';
import { ObjectId } from 'mongodb';

export const getMonsterMarkersByUserId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // lat and lng are optional!
    const { userId } = req.params;
    const { lat, lng } = req.query;

    const { db } = mongoInstance.getDb();

    // Get the maximum level of monster that can spawn on random level spawns
    const collectionUsers = db.collection<User>('users');
    const collectionSettings = db.collection<Setting<number>>('settings');
    const user = await collectionUsers.findOne({ id: userId });
    const expPerLevel =
      (await collectionSettings.findOne({ key: 'exp_per_level' }))?.value ??
      100;
    const userLevel = getUserLevel(user, expPerLevel);
    const maxMonsterLevel = userLevel;

    // Show only markers within some set distance
    const fixedLat = lat ? Number(Number(lat).toFixed(2)) : null;
    const fixedLng = lng ? Number(Number(lng).toFixed(2)) : null;

    const filterCoords =
      fixedLat && fixedLng
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
    const filterLevel = [{ level: null }, { level: { $lte: maxMonsterLevel } }];

    // Filter out monsters that have level requirements higher than user's level
    const collectionMonsters = db.collection<Monster>('monsters');
    const filterTooHighLevelRequirement: { monsterId: string }[] = [];
    const cursorAvailableMonsters = collectionMonsters.find({
      levelRequirements: { $gt: userLevel },
    });
    for await (const el of cursorAvailableMonsters) {
      filterTooHighLevelRequirement.push({ monsterId: el.id });
    }

    // Filter out monsters that are still respawning
    const collectionUserRespawn = db.collection<UserRespawn>('userRespawn');
    const filterCooldown: { _id: ObjectId }[] = [];
    const cursorUserRespawn = collectionUserRespawn.find({ userId });
    for await (const el of cursorUserRespawn) {
      if (el.markerType == 'monster')
        filterCooldown.push({ _id: new ObjectId(el.markerId) });
    }

    // Apply all filters and get all visible markers
    const collectionMonsterMarkers =
      db.collection<MonsterMarker>('markersMonster');
    const monsterMarkers: MonsterMarker[] = [];

    // Aggregate all filters together
    const orFilters = [...filterLevel];
    const norFilters = [...filterCooldown, ...filterTooHighLevelRequirement];

    const cursorMonsterMarkers = collectionMonsterMarkers.find({
      ...filterCoords,
      ...(orFilters.length ? { $or: orFilters } : {}),
      ...(norFilters.length ? { $nor: norFilters } : {}),
    });

    for await (const el of cursorMonsterMarkers) {
      monsterMarkers.push({
        ...el,
        id: String(el._id),
        level: el.level ?? determineMonsterLevel(userLevel),
      });
    }

    res.status(200).send(monsterMarkers);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
