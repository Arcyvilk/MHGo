import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import { happensWithAChanceOf, log } from '@mhgo/utils';
import {
  Item as TItem,
  Material,
  MonsterDrop,
  MonsterMarker,
  FieldByRarity,
  CraftType,
  UserMaterials,
  UserAmount,
  UserItems,
} from '@mhgo/types';

import { mongoInstance } from '../../../api';
import { getMaterialsWithRarity } from '../../helpers/getMaterialsWithRarity';
import {
  getUniqueItemDrops,
  getUniqueMaterialDrops,
} from '../../helpers/getUniqueDrops';

type ReqBody = { markerId: string; monsterLevel: number };
type ReqParams = { userId: string };

export const getDropsForUser = async (
  req: Request<ReqParams, ReqBody>,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { markerId, monsterLevel } = req.body;

    if (!userId) throw new Error('User ID missing!');
    if (!markerId) throw new Error('Monster marker ID missing!');

    const { db } = mongoInstance.getDb();

    // Get all materials
    const collectionMaterials = db.collection<Material>('materials');
    const materials: Material[] = [];
    const cursorMaterials = collectionMaterials.find();
    for await (const el of cursorMaterials) {
      materials.push(el);
    }

    // Get rarity of all materials
    const collectionRarityMaterials =
      db.collection<FieldByRarity>('rarityMaterials');
    const rarityMaterials: FieldByRarity[] = [];
    const cursorRarityMaterials = collectionRarityMaterials.find();
    for await (const el of cursorRarityMaterials) {
      rarityMaterials.push(el);
    }

    // Merge the two
    const materialsWithRarity = getMaterialsWithRarity(
      materials,
      rarityMaterials,
    );

    // Get all items
    const collectionItems = db.collection<TItem>('items');
    const items: TItem[] = [];
    const cursorItems = collectionItems.find();
    for await (const el of cursorItems) {
      items.push(el);
    }

    // Get the specified monster marker
    const collectionMonsterMarkers =
      db.collection<MonsterMarker>('monsterMarkers');
    const marker = await collectionMonsterMarkers.findOne({
      _id: new ObjectId(markerId),
    });

    // Get drops from the specified monster
    const monsterId = marker.monsterId;
    const collectionMonsterDrops = db.collection<MonsterDrop>('drops');
    const allMonsterDrops = await collectionMonsterDrops.findOne({ monsterId });
    const monsterDropsPerLevel = allMonsterDrops.drops.find(
      drop => drop.level === monsterLevel,
    );
    const allDrops = monsterDropsPerLevel.drops
      .map(drop => {
        const d = new Array(drop.amount)
          .fill(drop)
          .filter(drop => happensWithAChanceOf(drop.chance));
        return d;
      })
      .flat()
      .map(drop => ({ id: drop.id, type: drop.type }));

    const uniqueMaterialDrops = getUniqueMaterialDrops(
      allDrops,
      materialsWithRarity,
    );
    const uniqueItemDrops = getUniqueItemDrops(allDrops, items);
    const drops = [...uniqueMaterialDrops, ...uniqueItemDrops];

    // Give user's their new materials
    const collectionUserMaterials =
      db.collection<UserMaterials>('userMaterials');
    const userMaterials = await collectionUserMaterials.findOne({ userId });
    const materialsToUpdate = putUserMaterials(
      userMaterials.materials,
      uniqueMaterialDrops,
    );

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

    // Give user's their new items
    const collectionUserItems = db.collection<UserItems>('userItems');
    const userItems = await collectionUserItems.findOne({ userId });
    const itemsToUpdate = putUserItems(userItems.items, uniqueItemDrops);

    const responseItemsUpdate = await collectionUserItems.updateOne(
      { userId },
      {
        $set: {
          materials: itemsToUpdate,
        },
      },
      { upsert: true },
    );

    if (!responseItemsUpdate.acknowledged) {
      res.status(400).send({ error: "Could not update user's items." });
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
  const newUserMaterials = uniqueMaterialDrops.filter(
    (material: Material) =>
      !oldUserMaterials.some((m: UserAmount) => m.id === material.id),
  );

  const oldUserMaterialsUpdated = oldUserMaterials.map(
    (material: UserAmount) => {
      const newMaterialAmount = uniqueMaterialDrops.find(
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

  return [...newUserMaterials, ...oldUserMaterialsUpdated];
};

export const putUserItems = (
  oldUserItems: UserAmount[],
  uniqueItemDrops: (TItem & { dropClass: CraftType; amount: number })[],
): UserAmount[] => {
  const newUserItems = uniqueItemDrops.filter(
    (material: TItem) =>
      !oldUserItems.some((m: UserAmount) => m.id === material.id),
  );

  const oldUserItemsUpdated = oldUserItems.map((item: UserAmount) => {
    const newItemAmount = uniqueItemDrops.find(
      (m: UserAmount) => m.id === item.id,
    )?.amount;
    if (!newItemAmount) return item;
    const newAmount = (item.amount ?? 0) + newItemAmount;
    return {
      ...item,
      amount: newAmount,
    };
  });

  return [...newUserItems, ...oldUserItemsUpdated];
};
