import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Material } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const adminCreateMaterial = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res.locals.adventure);
    const { filter, ...material } = req.body as Material;

    // Check if the material with this ID already exists
    const newId =
      material.name.toLowerCase().replace(/ /g, '_') + material.rarity;
    const collection = db.collection<Omit<Material, 'filter'>>('materials');
    const materialWithSameId = await collection.findOne({ id: newId });
    if (materialWithSameId) {
      throw new Error(
        'A material with this ID already exists! Please change the material name to generate new material ID.',
      );
    }

    // Create material
    const responseMaterial = await collection.insertOne({
      ...material,
      id: newId,
      img: material.img.replace(process.env.CDN_URL, ''),
    });
    if (!responseMaterial.acknowledged) {
      res.status(400).send({ error: 'Could not create this material.' });
      return;
    }

    // Fin!
    res.status(201).send(responseMaterial);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
