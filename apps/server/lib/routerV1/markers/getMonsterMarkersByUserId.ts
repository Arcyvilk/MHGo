import { Request, Response } from 'express';
import { Monster, MonsterMarker, Setting, User } from '@mhgo/types';
import { log } from '@mhgo/utils';

import { mongoInstance } from '../../../api';
import {
  determineMonsterLevel,
  getUserLevel,
} from '../../helpers/getUserLevel';

export const getMonsterMarkersByUserId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const coords = req.body as number[] | undefined;

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

    // Get all the monster markers
    const collectionMonsterMarkers =
      db.collection<MonsterMarker>('markersMonster');
    const monsterMarkers: MonsterMarker[] = [];

    // Monster marker filters by coordinated
    const lat = coords.length === 2 ? Number(coords[0].toFixed(2)) : null;
    const long = coords.length === 2 ? Number(coords[1].toFixed(2)) : null;

    const filterCoords =
      coords.length === 2
        ? {
            'coords.0': {
              $lt: lat + 0.01,
              $gt: lat - 0.01,
            },
            'coords.1': {
              $lt: long + 0.01,
              $gt: long - 0.01,
            },
          }
        : {};

    // Monster marker filters by maximum level
    const filterLevel = [{ level: null }, { level: { $lte: maxMonsterLevel } }];

    const cursorMonsterMarkers = collectionMonsterMarkers.find({
      ...filterCoords,
      $or: [...filterLevel],
    });

    for await (const el of cursorMonsterMarkers) {
      monsterMarkers.push({
        ...el,
        id: String(el._id),
        level: el.level ?? determineMonsterLevel(userLevel),
      });
    }

    // Filter monster markers by user's level requirement
    const collectionMonsters = db.collection<Monster>('monsters');

    res.status(200).send(monsterMarkers);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
