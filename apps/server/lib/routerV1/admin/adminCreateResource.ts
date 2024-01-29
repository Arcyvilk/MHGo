import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Resource, ResourceDrop } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const adminCreateResource = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);
    const { resource, drops } = req.body as {
      resource: Resource;
      drops: ResourceDrop;
    };

    // Check if the resource with this ID already exists
    const newId = resource.name.toLowerCase().replace(/ /g, '_');
    const collectionResources = db.collection<Resource>('resources');
    const resourceWithSameId = await collectionResources.findOne({ id: newId });
    if (resourceWithSameId) {
      throw new Error(
        'A resource with this ID already exists! Please change the resource name to generate new resource ID.',
      );
    }

    // Create resource
    const responseResource = await collectionResources.insertOne({
      ...resource,
      id: resource.name.toLowerCase().replace(/ /g, '_'),
      img: resource.img.replace(process.env.CDN_URL, ''),
    });
    if (!responseResource.acknowledged) {
      res.status(400).send({ error: 'Could not create this resource.' });
      return;
    }

    // Create resource drops
    const collectionResourceDrops =
      db.collection<ResourceDrop>('dropsResource');
    const responseDrops = await collectionResourceDrops.insertOne(drops);
    if (!responseDrops.acknowledged) {
      res.status(400).send({ error: 'Could not create this resource drops.' });
      return;
    }

    // Fin!
    res.status(201).send(responseResource);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
