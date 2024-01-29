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

export const getUserCraftableItems = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { db } = mongoInstance.getDb(res.locals.adventure);

    if (!userId) throw new Error('Missing userId');

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

    // Get all items
    const collectionItems = db.collection<Item>('items');
    const items: Item[] = await collectionItems
      .find({ craftable: true })
      .toArray();

    // Get ingredients needed to craft those items
    const collectionItemCraftList = db.collection<ItemCraftList>('itemCraft');
    const itemCraftList = await collectionItemCraftList.find({}).toArray();

    const itemsWithCraftList = items.map(item => ({
      id: item.id,
      craftList: itemCraftList.find(i => i.itemId === item.id)?.craftList ?? [],
    }));

    // Check all items for if they can be crafted with user's current EQ
    const craftableItemIds = itemsWithCraftList
      .map(item => {
        const ingredientsMaterial = item.craftList.filter(
          ingredient => ingredient.craftType === 'material',
        );
        const ingredientsItem = item.craftList.filter(
          ingredient => ingredient.craftType === 'item',
        );
        const userOwnsAllItemIngredients = ingredientsItem
          .map(ingredient => {
            const ownedItem = userItems.find(i => i.id === ingredient.id);
            const amountNeeded = ingredient.amount;
            const canCraft = ownedItem && ownedItem.amount >= amountNeeded;
            return canCraft;
          })
          .reduce((acc, curr) => acc && curr, true);

        // Check if user has enough material ingredients to craft the item
        const userOwnsAllMatIngredients = ingredientsMaterial
          .map(ingredient => {
            const ownedMat = userMaterials.find(m => m.id === ingredient.id);
            const amountNeeded = ingredient.amount;
            const canCraft = ownedMat && ownedMat.amount >= amountNeeded;
            return canCraft;
          })
          .reduce((acc, curr) => acc && curr, true);

        const canCraft =
          Boolean(userOwnsAllItemIngredients) &&
          Boolean(userOwnsAllMatIngredients);

        if (canCraft) return item.id;
        else return null;
      })
      .filter(Boolean) as string[];

    res.status(200).send(craftableItemIds);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
