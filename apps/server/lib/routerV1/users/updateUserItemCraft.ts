import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import {
  Item,
  ItemCraftList,
  UserAmount,
  UserItems,
  UserMaterials,
} from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const updateUserItemCraft = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { userId, itemId } = req.params;
    const { amount = 1 } = req.body;

    // Check if item is craftable
    const collectionItems = db.collection<Item>('items');
    const item = await collectionItems.findOne({ id: itemId });
    if (!item) throw new Error('Requested item does not exist!');
    if (!item.craftable) throw new Error('Requested item is not craftable');

    // Get item crafting list
    const collectionItemCraftList = db.collection<ItemCraftList>('itemCraft');
    const itemCraftList = (await collectionItemCraftList.findOne({ itemId }))
      ?.craftList;
    if (!itemCraftList)
      throw new Error('This item has no ingredients to be crafted from!');

    // Filter item crafting list by craft type
    const ingredientsMaterial = itemCraftList.filter(
      ingredient => ingredient.craftType === 'material',
    );
    const ingredientsItem = itemCraftList.filter(
      ingredient => ingredient.craftType === 'item',
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

    // Check if user has enough item ingredients to craft the item
    const userOwnedItems = ingredientsItem.map(ingredient => {
      const ownedItem = userItems.find(i => i.id === ingredient.id);
      const amountNeeded = ingredient.amount * amount;
      if (!ownedItem || ownedItem.amount < amountNeeded)
        throw new Error(
          "User doesn't have enough ingredients to craft this item!",
        );
      return {
        ...ingredient,
        amount: ownedItem.amount - amountNeeded,
      };
    });

    // Check if user has enough material ingredients to craft the item
    const userOwnedMaterials = ingredientsMaterial.map(ingredient => {
      const ownedMat = userMaterials.find(m => m.id === ingredient.id);
      const amountNeeded = ingredient.amount * amount;
      if (!ownedMat || ownedMat.amount < amountNeeded)
        throw new Error(
          "User doesn't have enough ingredients to craft this item",
        );
      return {
        ...ingredient,
        amount: ownedMat.amount - amountNeeded,
      };
    });

    // Remove item ingredients from user's inventory
    let updatedUserItems: UserAmount[] = userItems
      .map(userItem => {
        const ownedItem = userOwnedItems.find(
          ownedItem => ownedItem.id === userItem.id,
        );
        if (!ownedItem) return userItem;
        if (ownedItem.amount <= 0) return null;
        return {
          ...userItem,
          amount: ownedItem.amount,
        };
      })
      .filter(Boolean);

    // Remove material ingredients from user's inventory
    const updatedUserMaterials: UserAmount[] = userMaterials
      .map(userMaterial => {
        const ownedMat = userOwnedMaterials.find(
          ownedMat => ownedMat.id === userMaterial.id,
        );
        if (!ownedMat) return userMaterial;
        if (ownedMat.amount <= 0) return null;
        return {
          ...userMaterial,
          amount: ownedMat.amount,
        };
      })
      .filter(Boolean);

    // Add newly crafted item to user's inventory
    const userHasItem = updatedUserItems.find(
      userItem => userItem.id === itemId,
    );

    // User already has item, bump its amount
    if (userHasItem) {
      const update = updatedUserItems.map(userItem => {
        if (userItem.id === itemId)
          return { ...userItem, amount: userItem.amount + amount };
        else return userItem;
      });
      updatedUserItems = update;
    }
    // User does not have item, add it
    else {
      updatedUserItems.push({ id: itemId, amount });
    }

    // Save everything to database
    const responseItems = await collectionUserItems.updateOne(
      { userId },
      { $set: { items: updatedUserItems } },
      { upsert: true },
    );
    const responseMaterials = await collectionUserMaterials.updateOne(
      { userId },
      { $set: { materials: updatedUserMaterials } },
      { upsert: true },
    );

    if (!responseMaterials.acknowledged)
      throw new Error('Could not update user materials.');
    if (!responseItems.acknowledged)
      throw new Error('Could not update user items.');

    // Fin!
    res.sendStatus(201);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
