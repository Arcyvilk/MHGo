import { Request, Response } from 'express';
import { log } from '@mhgo/utils';

import { mongoInstance } from '../../../api';
import { Biome, MonsterMarker } from '@mhgo/types';
import { changeReviewHelper } from '../../helpers/changeReviewHelper';

export const adminDeleteBiome = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const adventure = res?.locals?.adventure;
    const { db } = mongoInstance.getDb(adventure);

    const { biomeId } = req.params;

    if (!biomeId) throw new Error('Requested biome does not exist');

    const collectionBiomes = db.collection<Biome>('biomes');
    const biome = await collectionBiomes.findOne({ id: biomeId });

    // Information about the change that will be shared between all of the change reviews.
    const { addChangeReview } = changeReviewHelper({
      changedEntityId: biome.id,
      changedEntityType: 'biomes',
      changedEntityName: biome.name,
      changeType: 'delete',
    });

    /**
     * Delete all the markers that used the deleted biome
     */
    const collectionMarkersMonster =
      db.collection<MonsterMarker>('markersMonster');
    await collectionMarkersMonster.deleteMany({
      biomeId,
    });

    /**
     * Delete basic biome info
     */
    const responseBiomes = await collectionBiomes.deleteOne({
      id: biomeId,
    });
    if (!responseBiomes.acknowledged)
      throw new Error('Could not delete this biome.');

    /**
     * Document every monster that lost its spawn by deleting this biome
     */
    biome.monsters.forEach(monster => {
      addChangeReview(adventure, {
        affectedEntityId: monster.id,
        affectedEntityType: 'monsters',
        relation: 'place where monster spawned',
      });
    });

    // Fin!
    res.sendStatus(200);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
