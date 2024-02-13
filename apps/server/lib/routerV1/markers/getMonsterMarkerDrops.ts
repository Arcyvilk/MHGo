import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Setting, MonsterMarker, User } from '@mhgo/types';

import { mongoInstance } from '../../../api';
import { getUserLevel } from '../../helpers/getUserLevel';
import { determineMonsterLevel } from '../../helpers/getMonsterSpawn';
import { getGlobalSeed } from '../../helpers/getSeed';

export const getMonsterMarkerDrops = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { db } = mongoInstance.getDb(res?.locals?.adventure);
    const { dbAuth } = mongoInstance.getDbAuth();

    const collectionUsers = dbAuth.collection<User>('users');
    const collectionSettings = db.collection<Setting<number>>('settings');
    const collectionMonsterMarkers =
      db.collection<MonsterMarker>('markersMonster');

    const user = await collectionUsers.findOne({ id: userId });
    const expPerLevel =
      (await collectionSettings.findOne({ key: 'exp_per_level' }))?.value ??
      100;
    const userLevel = getUserLevel(user, expPerLevel);
    const maxMonsterLevel = userLevel;

    const monsterMarkers = [];

    const cursorMonsterMarkers = collectionMonsterMarkers.find({
      $or: [{ level: null }, { level: { $lte: maxMonsterLevel } }],
    });

    const globalSeed = await getGlobalSeed(db);

    for await (const marker of cursorMonsterMarkers) {
      monsterMarkers.push({
        ...marker,
        id: marker._id,
        level:
          marker.level ?? determineMonsterLevel(marker, userLevel, globalSeed),
      });
    }

    res.status(200).send(monsterMarkers);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
