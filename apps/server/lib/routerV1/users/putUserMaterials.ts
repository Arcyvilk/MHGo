import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { UserMaterials, type Material, type UserAmount } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const putUserMaterials = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collectionUserMaterials =
      db.collection<UserMaterials>('userMaterials');
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
        !oldUserMaterials.some((m: UserAmount) => m.id === material.id),
    );

    const oldUserMaterialsUpdated = oldUserMaterials.map(
      (material: UserAmount) => {
        const newMaterialAmount = materials.find(
          (m: UserAmount) => m.id === material.id,
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
