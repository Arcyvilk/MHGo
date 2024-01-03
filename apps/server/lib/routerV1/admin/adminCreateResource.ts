import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Resource } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const adminCreateResource = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();

    const collection = db.collection<Omit<Resource, 'filter'>>('resources');
    const resource = req.body as Resource;

    // Create resource
    const responseResource = await collection.insertOne({
      ...resource,
      id: resource.name.toLowerCase().replace(/ /g, '_'),
      img: resource.img.replace(process.env.CDN_URL, ''),
    });
    if (!responseResource.acknowledged) {
      res.status(400).send({ error: 'Could not create this resource.' });
      return;
    }

    // Fin!
    res.status(201).send(responseResource);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
