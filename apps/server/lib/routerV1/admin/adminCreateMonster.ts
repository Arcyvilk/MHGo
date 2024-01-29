import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Monster, MonsterDrop } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const adminCreateMonster = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res.locals.adventure);
    const collectionMonsterDrops = db.collection<MonsterDrop>('drops');
    const { monster, drops } = req.body as {
      monster: Monster;
      drops: MonsterDrop;
    };

    // Check if the item with this ID already exists
    const newId = monster.name.toLowerCase().replace(/ /g, '_');
    const collectionMonsters = db.collection<Monster>('monsters');
    const monsterWithSameId = await collectionMonsters.findOne({ id: newId });
    if (monsterWithSameId) {
      throw new Error(
        'A monster with this ID already exists! Please change the monster name to generate new monster ID.',
      );
    }

    // Create monster
    const responseMonsters = await collectionMonsters.insertOne({
      ...monster,
      id: newId,
      img: monster.img.replace(process.env.CDN_URL, ''),
    });
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
    res.status(201).send({ responseMonsters, responseDrops });
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
