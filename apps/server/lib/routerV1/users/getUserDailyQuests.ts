import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Quest, UserAmount, UserItems, UserQuestDaily } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getUserDailyQuests = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { userId } = req.params;
    if (!userId) throw new Error('Incorrect user ID provided');

    // Find if user has any active dailies
    const collectionUserDailyQuests =
      db.collection<UserQuestDaily>('userQuestsDaily');
    const userDailyQuests = await collectionUserDailyQuests.findOne({ userId });

    // If yes, just return those dailies
    if (userDailyQuests?.daily?.length) {
      res.status(200).send(userDailyQuests);
      return;
    }

    // If no, get three random dailies from the list...
    const collectionDailyQuests = db.collection<Quest>('questsDaily');
    const dailyQuests: Quest[] = [];
    const cursorDailyQuests = collectionDailyQuests.find();
    for await (const el of cursorDailyQuests) {
      dailyQuests.push(el);
    }

    const shuffled = dailyQuests.sort(() => 0.5 - Math.random()); // Shuffle array randomly
    const randomDailies = shuffled.slice(0, 3); // Get three first dailies from randomly shuffled list
    const randomUserDailies = {
      userId,
      dailyDate: new Date(new Date().setHours(24, 0, 0, 0)), // this sets expiration date to next midnight
      daily: randomDailies.map(r => ({
        id: r.id,
        progress: 0,
      })),
    };

    // ...And assign them to the user with TTL until midnight
    const responseUserDailies =
      await collectionUserDailyQuests.insertOne(randomUserDailies);

    if (!responseUserDailies.acknowledged)
      throw new Error('Failed to create new dailies for the user!');

    const indexName = `daily_reset_${userId}`;

    try {
      await collectionUserDailyQuests.dropIndex(indexName, {});
    } catch (_e) {
      // If this failed, it meant the index didnt exist
    }
    await collectionUserDailyQuests.createIndex(
      { dailyDate: 1 },
      {
        name: indexName,
        expireAfterSeconds: 0, // This will expire document when it gets to the date specified in "dailyDate"
      },
    );

    // Fin!
    res.status(200).send(randomUserDailies);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
