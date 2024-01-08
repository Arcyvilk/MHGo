import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Currency, CurrencyType, Setting, UserWealth } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const updateUserWealth = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { userId } = req.params;
    const newWealth: { [key in CurrencyType]?: number } = req.body;

    // Get base wealth
    const collectionSettings = db.collection<Setting<Currency[]>>('settings');
    const currencies = (
      await collectionSettings.findOne({ key: 'currency_types' })
    )?.value;
    if (!currencies)
      throw new Error("Couldn't get currency types from the database!");

    // Get wealth of every user
    const collectionUserWealth = db.collection<UserWealth>('userWealth');
    const userWealth = (
      await collectionUserWealth.findOne({
        userId,
      })
    )?.wealth;

    const updatedWealth = currencies.map(currency => {
      const newUserAmount = newWealth[currency.id] ?? 0;
      const oldUserAmount =
        userWealth.find(u => u.id === currency.id)?.amount ?? 0;

      return {
        id: currency.id,
        amount: oldUserAmount + newUserAmount,
      };
    });

    const response = await collectionUserWealth.updateOne(
      { userId },
      { $set: { wealth: updatedWealth } },
      { upsert: true },
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
