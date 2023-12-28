import express from 'express';
// import { apiV1Auth } from '../helpers/validate';

export const routerV1 = express.Router();

// TODO ADD API AUTH TO ALL ROUTES IN PROD!!!!

/****************************
 *         MONSTERS         *
 ****************************/

import { getMonsters } from './monsters';

routerV1.get('/monsters/list', getMonsters);

/*************************
 *         ITEMS         *
 *************************/

import { getItemUse } from './items';

routerV1.get('/items/item/:itemId/uses', getItemUse);

/*************************
 *         DROPS         *
 *************************/

import { getDrops, getDropsByMonsterId, getDropsForUser } from './drops';

routerV1.get('/drops/list', getDrops);
routerV1.get('/drops/monster/:monsterId', getDropsByMonsterId);
routerV1.put('/drops/user/:userId', getDropsForUser);

/************************
 *         USER         *
 ************************/

import {
  getUser,
  getUserEquipItem,
  getUserItems,
  getUserLoadout,
  getUserMaterials,
  getUserWealth,
  getUserStats,
} from './users';

routerV1.get('/users/user/:userId', getUser);
routerV1.get('/users/user/:userId/items/list', getUserItems);
routerV1.get('/users/user/:userId/loadout/list', getUserLoadout);
routerV1.get('/users/user/:userId/materials/list', getUserMaterials);
routerV1.get('/users/user/:userId/wealth/list', getUserWealth);
routerV1.get('/users/user/:userId/stats', getUserStats);
routerV1.get('/users/user/:userId/item/:itemId/equip', getUserEquipItem);

/****************************
 *         MAP         *
 ****************************/

import { getMonsterMarkersByUserId } from './monsterMarkers';

routerV1.get('/map/monsters/user/:userId', getMonsterMarkersByUserId);

/*****************************
 *         MATERIALS         *
 *****************************/

import {
  getMaterials,
  getRarityMaterials,
  getRarityMaterialsByRarity,
} from './materials';

routerV1.get('/materials/list', getMaterials);
routerV1.get('/materials/rarity/list', getRarityMaterials);
routerV1.get('/materials/rarity/:rarityId', getRarityMaterialsByRarity);

/****************************
 *         HABITATS         *
 ****************************/

import { getHabitats } from './habitats';

routerV1.get('/habitats/list', getHabitats);

/************************
 *         NEWS         *
 ************************/

import { getNews } from './news';

routerV1.get('/news/list', getNews);

/****************************
 *         SETTINGS         *
 ****************************/

import { getSettings } from './settings';

routerV1.get('/settings', getSettings);
