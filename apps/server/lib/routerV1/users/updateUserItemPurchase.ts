import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import {
  Item,
  ItemCraftList,
  ItemPrice,
  UserAmount,
  UserItems,
  UserWealth,
} from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const updateUserItemPurchase = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { userId, itemId } = req.params;
    const { amount = 1 } = req.body;

    // Check if item is purchasable
    const collectionItems = db.collection<Item>('items');
    const item = await collectionItems.findOne({ id: itemId });
    if (!item) throw new Error('Requested item does not exist!');
    if (!item.purchasable) throw new Error('Requested item is not on sale!');

    // Get item price
    const collectionItemPrice = db.collection<ItemPrice>('itemPrice');
    const itemPrice = (await collectionItemPrice.findOne({ itemId }))?.price;
    if (!itemPrice) throw new Error('This item is not on sale!');

    // Get user wealth
    const collectionUserWealth = db.collection<UserWealth>('userWealth');
    const userWealth =
      (
        await collectionUserWealth.findOne({
          userId,
        })
      )?.wealth ?? [];

    // Get user items
    const collectionUserItems = db.collection<UserItems>('userItems');
    const userItems =
      (
        await collectionUserItems.findOne({
          userId,
        })
      )?.items ?? [];

    // Check if user has enough money to purchase the item
    const userOwnedWealth = itemPrice.map(price => {
      const ownedCurrency = userWealth.find(w => w.id === price.id);
      const amountNeeded = price.amount * amount;
      if (!ownedCurrency || ownedCurrency.amount < amountNeeded)
        throw new Error("User doesn't have enough money to buy this item!");
      return { ...price, amount: ownedCurrency.amount - amountNeeded };
    });

    // Remove money from user's inventory
    const updatedUserWealth: UserAmount[] = userWealth.map(wealth => {
      const postPurchaseWealth = userOwnedWealth.find(
        userWealth => userWealth.id === wealth.id,
      );
      if (postPurchaseWealth)
        return {
          ...wealth,
          amount: postPurchaseWealth.amount,
        };
      else return wealth;
    });

    // Add newly crafted item to user's inventory
    let updatedUserItems = userItems;
    const userHasItem = userItems.find(userItem => userItem.id === itemId);

    // // User already has item, bump its amount
    if (userHasItem) {
      updatedUserItems = userItems.map(userItem => {
        if (userItem.id === itemId)
          return { ...userItem, amount: userItem.amount + amount };
        else return userItem;
      });
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

    if (!responseItems.acknowledged)
      throw new Error('Could not update user items.');

    const responseWealth = await collectionUserWealth.updateOne(
      { userId },
      { $set: { wealth: updatedUserWealth } },
      { upsert: true },
    );

    if (!responseWealth.acknowledged)
      throw new Error(
        'Could not update user money. Seems you got an item for free.',
      );

    // Fin!
    res.sendStatus(201);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
