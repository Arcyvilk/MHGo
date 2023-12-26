import { Request, Response } from 'express';

import { mongoInstance } from '../../../api';
import { log } from '@mhgo/utils';

// TODO share this with client type!
type Material = {
  id: string;
  img: string;
  name: string;
  description: string;
  rarity: number;
  filter: string;
};
type UserMaterial = { id: string; amount: number };

export const putUserMaterials = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collectionUserMaterials = db.collection('userMaterials');
    const { userId } = req.params;
    const materials = req.body;

    /**
     * Find member materials
     */
    const oldUserMaterials =
      (
        await collectionUserMaterials.findOne({
          userId,
        })
      )?.materials ?? [];

    const newUserMaterials = materials.filter(
      (material: Material) =>
        !oldUserMaterials.some((m: UserMaterial) => m.id === material.id),
    );

    const oldUserMaterialsUpdated = oldUserMaterials.map(
      (material: UserMaterial) => {
        const newMaterialAmount = materials.find(
          (m: UserMaterial) => m.id === material.id,
        )?.amount;
        if (!newMaterialAmount) return material;
        const newAmount = (material.amount ?? 0) + newMaterialAmount;
        return {
          ...material,
          amount: newAmount,
        };
      },
    );

    const allUpdatedMaterials = [
      ...newUserMaterials,
      ...oldUserMaterialsUpdated,
    ];

    const responseMaterialsUpdate = await collectionUserMaterials.updateOne(
      { userId },
      {
        $set: {
          materials: allUpdatedMaterials,
        },
      },
      { upsert: true },
    );

    if (!responseMaterialsUpdate.acknowledged) {
      res.status(400).send({ error: "Could not update user's materials." });
    } else {
      res.status(201).send(responseMaterialsUpdate);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
