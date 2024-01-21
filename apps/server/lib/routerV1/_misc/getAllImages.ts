import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Habitat, Item, Material, Monster, Resource } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getAllImages = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const images: string[] = [];

    // All collections including images
    const collectionHabitats = db.collection<Habitat>('habitats');
    const collectionItems = db.collection<Item>('items');
    const collectionMaterials = db.collection<Material>('materials');
    const collectionMonsters = db.collection<Monster>('monsters');
    const collectionResources = db.collection<Resource>('resources');

    const cursorHabitats = collectionHabitats.find();
    const cursorItems = collectionItems.find();
    const cursorMaterials = collectionMaterials.find();
    const cursorMonsters = collectionMonsters.find();
    const cursorResources = collectionResources.find();

    for await (const el of cursorHabitats) images.push(el.image);
    for await (const el of cursorItems) images.push(el.img);
    for await (const el of cursorMaterials) images.push(el.img);
    for await (const el of cursorResources) images.push(el.img);
    for await (const el of cursorMonsters) {
      images.push(el.img);
      images.push(el.thumbnail);
    }

    res.status(200).send(images);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
