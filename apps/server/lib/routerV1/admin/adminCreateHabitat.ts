import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Habitat } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const adminCreateHabitat = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);
    const habitat = req.body as Habitat;

    // Check if the habitat with this ID already exists
    const newId = habitat.name.toLowerCase().replace(/ /g, '_');
    const collectionHabitats = db.collection<Habitat>('habitats');
    const habitatWithSameId = await collectionHabitats.findOne({ id: newId });
    if (habitatWithSameId) {
      throw new Error(
        'A habitat with this ID already exists! Please change the habitat name to generate new habitat ID.',
      );
    }

    // Create habitat
    const responseHabitat = await collectionHabitats.insertOne({
      ...habitat,
      id: newId,
      image: habitat.image.replace(process.env.CDN_URL, ''),
    });
    if (!responseHabitat.acknowledged) {
      res.status(400).send({ error: 'Could not create this habitat.' });
      return;
    }

    // Fin!
    res.status(201).send(responseHabitat);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
