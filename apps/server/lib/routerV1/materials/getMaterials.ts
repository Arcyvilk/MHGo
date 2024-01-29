import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Material } from '@mhgo/types';

import { mongoInstance } from '../../../api';
import { addFilterToMaterials } from '../../helpers/addFilterToMaterials';

export const getMaterials = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res.locals.adventure);

    // Get all materials
    const collectionMaterials = db.collection<Material>('materials');
    const materials: Material[] = [];
    const cursorMaterials = collectionMaterials.find().sort({ rarity: 'desc' });
    for await (const el of cursorMaterials) {
      materials.push(el);
    }

    const materialsWithFilter = await addFilterToMaterials(materials);

    res.status(200).send(materialsWithFilter);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
