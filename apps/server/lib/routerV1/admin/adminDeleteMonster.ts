import { Request, Response } from 'express';
import { log } from '@mhgo/utils';

import { mongoInstance } from '../../../api';
import { Habitat, Monster, MonsterDrop } from '@mhgo/types';

export const adminDeleteMonster = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);

    const { monsterId } = req.params;

    if (!monsterId) throw new Error('Requested monster does not exist');

    // Delete basic monster info
    const collectionMonsters = db.collection<Monster>('monsters');
    const responseMonster = await collectionMonsters.deleteOne({
      id: monsterId,
    });
    if (!responseMonster.acknowledged)
      throw new Error('Could not delete this monster.');

    // Delete all monster drops
    const collectionDrops = db.collection<MonsterDrop>('drops');
    await collectionDrops.deleteMany({ monsterId });

    // Delete this monster from all habitats
    const collectionHabitats = db.collection<Habitat>('habitats');
    const responseHabitats = await collectionHabitats.find().toArray();

    responseHabitats
      .filter(habitat =>
        habitat.monsters.find(monster => monster.id === monsterId),
      )
      .forEach(habitat => {
        const { monsters } = habitat;
        const otherMonsters = monsters.filter(
          monster => monster.id !== monsterId,
        );
        const deletedMonsterSpawnChance = monsters.find(
          monster => monster.id === monsterId,
        ).spawnChance;
        const sharedSpawnChanceForOthers =
          deletedMonsterSpawnChance / otherMonsters.length;
        const otherMonstersWithBoostedSpawnChance = otherMonsters.map(
          monster => ({
            ...monster,
            spawnChance: monster.spawnChance + sharedSpawnChanceForOthers,
          }),
        );

        collectionHabitats.updateOne(
          { id: habitat.id },
          { $set: { monsters: otherMonstersWithBoostedSpawnChance } },
        );
      });

    // Fin!
    res.sendStatus(200);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
