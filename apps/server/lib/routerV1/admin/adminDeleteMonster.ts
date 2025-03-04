import { Request, Response } from 'express';
import { log } from '@mhgo/utils';

import { mongoInstance } from '../../../api';
import { Biome, Monster, MonsterDrop } from '@mhgo/types';
import { changeReviewHelper } from '../../helpers/changeReviewHelper';

export const adminDeleteMonster = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const adventure = res?.locals?.adventure;
    const { db } = mongoInstance.getDb(adventure);

    const { monsterId } = req.params;

    if (!monsterId) throw new Error('Requested monster does not exist');

    /**
     * Get existing basic data of the monster
     */
    const collectionMonsters = db.collection<Monster>('monsters');
    const monster = await collectionMonsters.findOne({ id: monsterId });

    // Information about the change that will be shared between all of the change reviews.
    const { addChangeReview } = changeReviewHelper({
      changedEntityId: monster.id,
      changedEntityType: 'monsters',
      changedEntityName: monster.name,
      changeType: 'delete',
    });

    /**
     * Delete all monster drops
     */
    const collectionDrops = db.collection<MonsterDrop>('dropsMonster');
    await collectionDrops.deleteMany({ monsterId });

    /**
     * Delete this monster from all biomes
     */
    const collectionBiomes = db.collection<Biome>('biomes');
    const responseBiomes = await collectionBiomes
      .find({ 'monsters.id': monsterId })
      .toArray();

    responseBiomes.forEach(biome => {
      const updatedMonsters = normalizeSpawnRatio(biome, monsterId);

      collectionBiomes.updateOne(
        { id: biome.id },
        { $set: { monsters: updatedMonsters } },
      );

      addChangeReview(adventure, {
        affectedEntityId: biome.id,
        affectedEntityType: 'biomes',
        relation: 'spawn in biome',
      });
    });

    /**
     * At the very end:
     * Delete basic monster info
     */
    const responseMonster = await collectionMonsters.deleteOne({
      id: monsterId,
    });
    if (!responseMonster.acknowledged)
      throw new Error('Could not delete this monster.');

    // Fin!
    res.sendStatus(200);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

/**
 * In a single biome, all of the monsters spawn rations sum to 100.
 * When a monster is deleted, its spawn ratio is also deleted, what means
 * that the spawns don't sum to 100 anymore, so we have to distribute
 * its spawn ratio between all the monsters remaining in the biome.
 *
 * TODO: What happens if there is only one monster left and it's deleted?
 */
const normalizeSpawnRatio = (biome: Biome, monsterId: string) => {
  const { monsters } = biome;
  const otherMonsters = monsters.filter(monster => monster.id !== monsterId);

  // Get the spawn chance of the deleted monster...
  const deletedMonsterSpawnChance = monsters.find(
    monster => monster.id === monsterId,
  ).spawnChance;

  // ...and share it evenly between the remaining monsters
  const sharedSpawnChanceForOthers =
    deletedMonsterSpawnChance / otherMonsters.length;

  // And now update the list of monsters with the new spawn ratios!
  const otherMonstersWithBoostedSpawnChance = otherMonsters.map(monster => ({
    ...monster,
    spawnChance: monster.spawnChance + sharedSpawnChanceForOthers,
  }));

  return otherMonstersWithBoostedSpawnChance;
};
