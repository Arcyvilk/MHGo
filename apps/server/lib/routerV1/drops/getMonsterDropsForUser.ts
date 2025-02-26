import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import { happensWithAChanceOf, log } from '@mhgo/utils';
import {
  Item as TItem,
  Material,
  MonsterDrop,
  CraftType,
  UserMaterials,
  UserAmount,
  UserItems,
  Setting,
  UserRespawn,
  Drop,
  MonsterMarker,
} from '@mhgo/types';

import {
  getUniqueItemDrops,
  getUniqueMaterialDrops,
} from '../../helpers/getUniqueDrops';
import { addFilterToMaterials } from '../../helpers/addFilterToMaterials';
import { DEFAULT_RESPAWN_TIME } from '../../helpers/defaults';
import { mongoInstance } from '../../../api';

type ReqBody = { markerId: string; monsterId: string; monsterLevel: number };
type ReqParams = { userId: string };

export const getMonsterDropsForUser = async (
  req: Request<ReqParams, ReqBody>,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { markerId, monsterId, monsterLevel } = req.body;

    if (!userId) throw new Error('User ID missing!');
    if (!markerId) throw new Error('Marker ID missing!');
    if (!monsterId) throw new Error('Monster ID missing!');

    const { db } = mongoInstance.getDb(res?.locals?.adventure);

    // Get the specified monster marker
    const collectionMonsterMarkers =
      db.collection<MonsterMarker>('markersMonster');
    const marker = await collectionMonsterMarkers.findOne({
      _id: new ObjectId(markerId),
    });

    if (!marker) throw new Error('This marker does not exist!');

    // Get all materials
    const collectionMaterials = db.collection<Material>('materials');
    const materials: Material[] = [];
    const cursorMaterials = collectionMaterials.find();
    for await (const el of cursorMaterials) {
      materials.push(el);
    }
    const materialsWithFilter = await addFilterToMaterials(db, materials);

    // Get all items
    const collectionItems = db.collection<TItem>('items');
    const items: TItem[] = [];
    const cursorItems = collectionItems.find();
    for await (const el of cursorItems) {
      items.push(el);
    }

    // Get drops from the specified monster
    const collectionMonsterDrops = db.collection<MonsterDrop>('dropsMonster');
    const allMonsterDrops = await collectionMonsterDrops.findOne({ monsterId });
    const monsterDropsPerLevel = allMonsterDrops.drops.find(
      drop => drop.level === monsterLevel,
    );
    const allDrops = (monsterDropsPerLevel?.drops ?? [])
      .map(drop => {
        const d = new Array(drop.amount)
          .fill(drop)
          .filter(drop => happensWithAChanceOf(drop.chance));
        return d;
      })
      .flat()
      .map((drop: Drop) => ({ id: drop.id, type: drop.type }));

    const uniqueMaterialDrops = getUniqueMaterialDrops(
      allDrops,
      materialsWithFilter,
    );
    const uniqueItemDrops = getUniqueItemDrops(allDrops, items);

    // Give user's their new materials
    const collectionUserMaterials =
      db.collection<UserMaterials>('userMaterials');
    const userMaterials = await collectionUserMaterials.findOne({ userId });
    const materialsToUpdate = putUserMaterials(
      userMaterials?.materials ?? [],
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
    const itemsToUpdate = putUserItems(userItems?.items ?? [], uniqueItemDrops);

    const responseItemsUpdate = await collectionUserItems.updateOne(
      { userId },
      {
        $set: {
          items: itemsToUpdate,
        },
      },
      { upsert: true },
    );

    if (!responseItemsUpdate.acknowledged) {
      res.status(400).send({ error: "Could not update user's items." });
    }

    // Put marker on cooldown
    const isCustomRespawnTime = marker.respawnTime !== undefined;
    const collectionSettings = db.collection<Setting<number>>('settings');
    const monsterRespawnTime =
      marker.respawnTime ??
      (await collectionSettings.findOne({ key: 'respawn_time_monster' }))
        ?.value ??
      DEFAULT_RESPAWN_TIME;

    const collectionUserRespawn = db.collection<UserRespawn>('userRespawn');
    await collectionUserRespawn.insertOne({
      userId,
      markerId,
      markerType: 'monster',
      usedAt: new Date(),
    });

    const indexName = isCustomRespawnTime
      ? `respawn_time_monster_${markerId}`
      : 'respawn_time_monster';

    try {
      await collectionUserRespawn.dropIndex(indexName, {});
    } catch (_e) {
      // If this failed, it meant the index didnt exist
    }
    await collectionUserRespawn.createIndex(
      { usedAt: 1 },
      {
        name: indexName,
        partialFilterExpression: {
          markerType: 'monster',
          ...(isCustomRespawnTime ? { markerId } : {}),
        },
        expireAfterSeconds: monsterRespawnTime,
      },
    );

    // We don't want to show certificate drops
    const visibleDrops = [
      ...uniqueMaterialDrops,
      ...uniqueItemDrops.filter(item => item.type !== 'certificate'),
    ];

    // Fin!
    res.status(200).send(visibleDrops);
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

export const putUserItems = (
  oldUserItems: UserAmount[],
  uniqueItemDrops: (TItem & { dropClass: CraftType; amount: number })[],
): UserAmount[] => {
  const newUserItems = uniqueItemDrops
    .filter(
      (material: TItem) =>
        !oldUserItems.some((m: UserAmount) => m.id === material.id),
    )
    .map(i => ({ id: i.id, amount: i.amount }));

  const oldUserItemsUpdated = oldUserItems.map((item: UserAmount) => {
    const newItemAmount = uniqueItemDrops.find(
      (m: UserAmount) => m.id === item.id,
    )?.amount;
    if (!newItemAmount) return item;
    const newAmount = (item.amount ?? 0) + newItemAmount;
    return {
      id: item.id,
      amount: newAmount,
    };
  });

  return [...newUserItems, ...oldUserItemsUpdated];
};
