import { Request, Response } from 'express';
import {
  Habitat,
  HabitatMarker,
  Monster,
  MonsterMarker,
  Setting,
  User,
  UserRespawn,
} from '@mhgo/types';
import { log } from '@mhgo/utils';

import { mongoInstance } from '../../../api';
import { getUserLevel } from '../../helpers/getUserLevel';
import { determineMonsterSpawn } from '../../helpers/getMonsterSpawn';
import { ObjectId } from 'mongodb';

export const getMonsterMarkersByUserId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // lat and lng are optional!
    const { userId } = req.params;
    const { lat, lng } = req.query;

    const { db } = mongoInstance.getDb(res?.locals?.adventure);
    const { dbAuth } = mongoInstance.getDbAuth();

    // Get all habitats
    const collectionHabitats = db.collection<Habitat>('habitats');
    const habitats = await collectionHabitats.find().toArray();

    // Get the maximum level of monster that can spawn on random level spawns
    const collectionUsers = dbAuth.collection<User>('users');
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

    // Filter out markers that are still respawning
    const collectionUserRespawn = db.collection<UserRespawn>('userRespawn');
    const filterCooldown: { _id: ObjectId }[] = [];
    const cursorUserRespawn = collectionUserRespawn.find({ userId });
    for await (const el of cursorUserRespawn) {
      if (el.markerType == 'monster')
        filterCooldown.push({ _id: new ObjectId(el.markerId) });
    }

    // Apply all filters and get all visible markers
    const collectionMonsterMarkers =
      db.collection<HabitatMarker>('markersMonster');
    const monsterMarkers: MonsterMarker[] = [];

    // Aggregate all filters together
    const orFilters = [...filterLevel];
    const norFilters = [...filterCooldown]; //, ...filterTooHighLevelRequirement];

    const cursorMonsterMarkers = collectionMonsterMarkers.find({
      ...filterCoords,
      ...(orFilters.length ? { $or: orFilters } : {}),
      ...(norFilters.length ? { $nor: norFilters } : {}),
    });

    // Filter out out monsters that have level requirements higher than user's level
    // and ones that are disabled
    const collectionMonsters = db.collection<Monster>('monsters');
    const disabledMonsters = (
      await collectionMonsters
        .find({
          $or: [{ levelRequirements: { $gt: userLevel } }, { disabled: true }],
        })
        .toArray()
    ).map(monster => monster.id);

    for await (const marker of cursorMonsterMarkers) {
      const spawnedMonster = determineMonsterSpawn(
        marker,
        habitats,
        disabledMonsters,
        userLevel,
      );
      if (spawnedMonster.shouldSpawn)
        monsterMarkers.push({
          ...marker,
          id: String(marker._id),
          monsterId: spawnedMonster.monsterId,
          level: spawnedMonster.monsterLevel,
        });
    }

    res.status(200).send(monsterMarkers);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
