import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { FieldByRarity, Material } from '@mhgo/types';

import { mongoInstance } from '../../../api';
import { getMaterialsWithRarity } from '../../helpers/getMaterialsWithRarity';

export const getMaterials = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();

    // Get all materials
    const collectionMaterials = db.collection<Material>('materials');
    const materials: Material[] = [];
    const cursorMaterials = collectionMaterials.find();
    for await (const el of cursorMaterials) {
      materials.push(el);
    }

    // Get all materials' rarity
    const collectionRarity = db.collection<FieldByRarity>('rarityMaterials');
    const rarity: FieldByRarity[] = [];
    const cursorRarity = collectionRarity.find();
    for await (const el of cursorRarity) {
      rarity.push(el);
    }

    const materialsWithRarity = getMaterialsWithRarity(materials, rarity);

    res.status(200).send(materialsWithRarity);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
