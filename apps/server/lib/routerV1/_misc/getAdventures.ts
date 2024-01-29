import { Request, Response } from 'express';

import { log } from '@mhgo/utils';
import { Adventure } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getAdventures = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { dbAuth } = mongoInstance.getDbAuth();

    const collectionAchievements = dbAuth.collection<Adventure>('adventures');
    const adventures = await collectionAchievements
      .find({ enabled: true })
      .toArray();

    res.status(200).send(adventures);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
