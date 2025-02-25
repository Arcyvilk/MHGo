import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Quest } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const adminGetAllToReview = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);

    // Get list of quests (daily)
    const collectionQuestsDaily = db.collection<Quest>('questsDaily');
    const questsDaily: Quest[] = await collectionQuestsDaily.find().toArray();

    res.status(200).send(questsDaily);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

export const adminGetAllQuestsStory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);

    // Get list of quests (story)
    const collectionQuestsStory = db.collection<Quest>('quests');
    const questsStory: Quest[] = await collectionQuestsStory.find().toArray();

    res.status(200).send(questsStory);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
