import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { TutorialStep } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getTutorial = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { stepFrom, stepTo } = req.query;
    const { db } = mongoInstance.getDb();
    const collection = db.collection<TutorialStep>('tutorial');
    const tutorial: TutorialStep[] = [];

    const cursor = collection.find();

    for await (const el of cursor) {
      tutorial.push(el);
    }

    const indexFrom = tutorial.findIndex(t => t.id === stepFrom) ?? 0;
    const indexTo = tutorial.findIndex(t => t.id === stepTo) ?? null;
    const nextPartId = tutorial[indexTo + 1]?.id ?? null;

    const filteredTutorial =
      !indexTo || indexTo <= indexFrom
        ? tutorial.slice(indexFrom)
        : tutorial.slice(indexFrom, indexTo + 1);

    res.status(200).send({
      tutorial: filteredTutorial,
      nextPartId,
    });
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
