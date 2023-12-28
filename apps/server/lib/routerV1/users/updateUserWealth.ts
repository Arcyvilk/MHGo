import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { CurrencyType, UserWealth } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const updateUserWealth = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { userId } = req.params;
    const currencies: { [key in CurrencyType]?: number } = req.body;

    // Get wealth of every user
    const collectionUserWealth = db.collection<UserWealth>('userWealth');
    const userWealth = await collectionUserWealth.findOne({
      userId,
    });

    const updatedWealth = userWealth.wealth.map(currency => ({
      ...currency,
      amount: currency.amount + (currencies[currency.id] ?? 0),
    }));

    const response = await collectionUserWealth.updateOne(
      { userId },
      { $set: { wealth: updatedWealth } },
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update users wealth.' });
    } else {
      res.sendStatus(200);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
