import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { UserQuestStory } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getUserStoryQuests = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);
    const { userId } = req.params;
    if (!userId) throw new Error('Incorrect user ID provided');

    const collectionUserStoryQuests =
      db.collection<UserQuestStory>('userQuests');
    const userStoryQuests: Omit<UserQuestStory, 'userId'>[] = [];
    const cursorUserStoryQuests = collectionUserStoryQuests.find({ userId });

    for await (const el of cursorUserStoryQuests) {
      const { userId: _, ...rest } = el;
      userStoryQuests.push(rest);
    }

    const sortedUserStoryQuests = [
      ...userStoryQuests.filter(q => !q.isClaimed),
      ...userStoryQuests.filter(q => q.isClaimed),
    ];

    // Fin!
    res.status(200).send(sortedUserStoryQuests);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
