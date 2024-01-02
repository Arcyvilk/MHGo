import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Monster, MonsterDrop } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const adminCreateMonster = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();

    const collectionMonsters = db.collection<Monster>('monsters');
    const collectionMonsterDrops = db.collection<MonsterDrop>('drops');
    const { monster, drops } = req.body as {
      monster: Monster;
      drops: MonsterDrop;
    };

    // Create monster
    const responseMonsters = await collectionMonsters.insertOne(monster);
    if (!responseMonsters.acknowledged) {
      res.status(400).send({ error: 'Could not create this monster.' });
      return;
    }

    // Create monster drops
    const responseDrops = await collectionMonsterDrops.insertOne(drops);
    if (!responseDrops.acknowledged) {
      res.status(400).send({ error: 'Could not create this monster.' });
      return;
    }

    // Fin!
    res.sendStatus(201);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
