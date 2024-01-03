import { Request, Response } from 'express';
import { log } from '@mhgo/utils';

import { mongoInstance } from '../../../api';
import {
  determineMonsterLevel,
  getUserLevel,
} from '../../helpers/getUserLevel';
import { MonsterMarker, Setting, User } from '@mhgo/types';

export const getMonsterMarkerDrops = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { db } = mongoInstance.getDb();

    const collectionUsers = db.collection<User>('users');
    const collectionSettings = db.collection<Setting<number>>('settings');
    const collectionMonsterMarkers =
      db.collection<MonsterMarker>('markersMonster');;

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

    for await (const el of cursorMonsterMarkers) {
      monsterMarkers.push({
        ...el,
        id: el._id,
        level: el.level ?? determineMonsterLevel(userLevel),
      });
    }

    res.status(200).send(monsterMarkers);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
