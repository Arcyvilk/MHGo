import { Request, Response } from 'express';

import { happensWithAChanceOf, log } from '@mhgo/utils';
import {
  Material,
  CraftType,
  UserMaterials,
  UserAmount,
  ResourceMarker,
  Resource,
} from '@mhgo/types';

import { mongoInstance } from '../../../api';
import { getUniqueMaterialDrops } from '../../helpers/getUniqueDrops';
import { addFilterToMaterials } from '../../helpers/addFilterToMaterials';

type ReqBody = { markerId: string; monsterLevel: number };
type ReqParams = { userId: string };

export const getResourceDropsForUser = async (
  req: Request<ReqParams, ReqBody>,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { markerId } = req.body;

    if (!userId) throw new Error('User ID missing!');
    if (!markerId) throw new Error('Resource marker ID missing!');

    const { db } = mongoInstance.getDb();

    // Get all materials
    const collectionMaterials = db.collection<Material>('materials');
    const materials: Material[] = [];
    const cursorMaterials = collectionMaterials.find();
    for await (const el of cursorMaterials) {
      materials.push(el);
    }
    const materialsWithFilter = await addFilterToMaterials(materials);

    // Get the specified resource marker
    const collectionResourceMarkers =
      db.collection<ResourceMarker>('markersResource');
    const marker = await collectionResourceMarkers.findOne({
      id: markerId,
    });

    // Get drops from the specified resource
    const resourceId = marker.resourceId;
    const collectionResources = db.collection<Resource>('resources');
    const resourceDrops = await collectionResources.findOne({ id: resourceId });
    const allDrops = (resourceDrops?.drops ?? [])
      .map(drop => {
        const d = new Array(drop.amount)
          .fill(drop)
          .filter(drop => happensWithAChanceOf(drop.chance));
        return d;
      })
      .flat()
      .map(drop => ({ id: drop.id, type: drop.type }));

    const drops = getUniqueMaterialDrops(allDrops, materialsWithFilter);

    // Give user's their new materials
    const collectionUserMaterials =
      db.collection<UserMaterials>('userMaterials');
    const userMaterials = await collectionUserMaterials.findOne({ userId });
    const materialsToUpdate = putUserMaterials(userMaterials.materials, drops);

    const responseMaterialsUpdate = await collectionUserMaterials.updateOne(
      { userId },
      {
        $set: {
          materials: materialsToUpdate,
        },
      },
      { upsert: true },
    );

    if (!responseMaterialsUpdate.acknowledged) {
      res.status(400).send({ error: "Could not update user's materials." });
    }

    // Fin!
    res.status(200).send(drops);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

export const putUserMaterials = (
  oldUserMaterials: UserAmount[],
  uniqueMaterialDrops: (Material & { dropClass: CraftType; amount: number })[],
): UserAmount[] => {
  const newUserMaterials = uniqueMaterialDrops
    .filter(
      (material: Material) =>
        !oldUserMaterials.some((m: UserAmount) => m.id === material.id),
    )
    .map(m => ({ id: m.id, amount: m.amount }));

  const oldUserMaterialsUpdated = oldUserMaterials.map(
    (material: UserAmount) => {
      const newMaterialAmount = uniqueMaterialDrops.find(
        (m: UserAmount) => m.id === material.id,
      )?.amount;
      if (!newMaterialAmount) return material;
      const newAmount = (material.amount ?? 0) + newMaterialAmount;
      return {
        id: material.id,
        amount: newAmount,
      };
    },
  );

  return [...newUserMaterials, ...oldUserMaterialsUpdated];
};