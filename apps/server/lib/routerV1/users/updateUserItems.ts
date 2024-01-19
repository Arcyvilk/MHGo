import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Reward, UserItems, UserMaterials } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const updateUserItems = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { userId } = req.params;
    const rewardsToAdd = req.body as Reward[];

    const itemsToAdd = rewardsToAdd.filter(reward => reward.type === 'item');
    const materialsToAdd = rewardsToAdd.filter(
      reward => reward.type === 'material',
    );

    // Get user items
    const collectionUserItems = db.collection<UserItems>('userItems');
    const userItems =
      (
        await collectionUserItems.findOne({
          userId,
        })
      )?.items ?? [];

    // Get user materials
    const collectionUserMaterials =
      db.collection<UserMaterials>('userMaterials');
    const userMaterials =
      (
        await collectionUserMaterials.findOne({
          userId,
        })
      )?.materials ?? [];

    // Add newly acquired item to user's inventory
    let updatedUserItems = userItems;

    itemsToAdd.forEach(item => {
      const userHasItem = userItems.find(userItem => userItem.id === item.id);
      // User already has item, bump its amount
      if (userHasItem) {
        updatedUserItems = userItems.map(userItem => {
          if (userItem.id === item.id)
            return { ...userItem, amount: userItem.amount + item.amount };
          else return userItem;
        });
      }
      // User does not have item, add it
      else {
        updatedUserItems.push({ id: item.id, amount: item.amount });
      }
    });

    // Add newly acquired material to user's inventory
    let updatedUserMaterials = userMaterials;

    materialsToAdd.forEach(material => {
      const userHasMaterial = userMaterials.find(
        userMat => userMat.id === material.id,
      );
      // User already has material, bump its amount
      if (userHasMaterial) {
        updatedUserMaterials = userMaterials.map(userMaterial => {
          if (userMaterial.id === material.id)
            return {
              ...userMaterial,
              amount: userMaterial.amount + material.amount,
            };
          else return userMaterial;
        });
      }
      // User does not have material, add it
      else {
        updatedUserMaterials.push({ id: material.id, amount: material.amount });
      }
    });

    // Save items to database
    const responseItems = await collectionUserItems.updateOne(
      { userId },
      { $set: { items: updatedUserItems } },
      { upsert: true },
    );

    if (!responseItems.acknowledged)
      throw new Error('Could not update user items.');

    // Save materials to database
    const responseMaterials = await collectionUserMaterials.updateOne(
      { userId },
      { $set: { materials: updatedUserMaterials } },
      { upsert: true },
    );

    if (!responseMaterials.acknowledged)
      throw new Error('Could not update user materials.');

    // Fin!
    res.sendStatus(200);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
