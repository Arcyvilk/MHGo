import express from 'express';
// import { apiV1Auth } from '../helpers/validate';

export const routerV1 = express.Router();

// TODO ADD API AUTH TO ALL ROUTES IN PROD!!!!

/********************************
 *         ADMIN ROUTES         *
 ********************************/

import {
  adminGetAllUsers,
  adminUpdateUser,
  adminResetUser,
  adminUserEnableGodmode,
  adminCreateItem,
  adminCreateMaterial,
  adminCreateMonster,
  adminUpdateItem,
  adminUpdateItemAction,
  adminUpdateItemCrafts,
  adminUpdateItemStats,
  adminUpdateMaterial,
  adminUpdateMonster,
  adminCreateMonsterMarker,
  adminUpdateMonsterMarker,
  adminDeleteMonsterMarker,
  adminCreateResourceMarker,
  adminUpdateResourceMarker,
  adminDeleteResourceMarker,
  adminCreateResource,
  adminUpdateResource,
  adminUpdateMonsterDrops,
  adminUpdateSettings,
} from './admin';

routerV1.get('/admin/users/list', adminGetAllUsers);
routerV1.put('/admin/users/user/:userId', adminUpdateUser);
routerV1.put('/admin/users/user/:userId/reset', adminResetUser);
routerV1.post('/admin/users/user/:userId/godmode', adminUserEnableGodmode);

routerV1.post('/admin/items/create', adminCreateItem);
routerV1.post('/admin/materials/create', adminCreateMaterial);
routerV1.post('/admin/monsters/create', adminCreateMonster);
routerV1.post('/admin/resources/create', adminCreateResource);

routerV1.put('/admin/items/item/:itemId', adminUpdateItem);
routerV1.put('/admin/items/item/:itemId/action', adminUpdateItemAction);
routerV1.put('/admin/items/item/:itemId/crafts', adminUpdateItemCrafts);
routerV1.put('/admin/items/item/:itemId/stats', adminUpdateItemStats);

routerV1.put('/admin/materials/material/:materialId', adminUpdateMaterial);
routerV1.put('/admin/monsters/monster/:monsterId', adminUpdateMonster);
routerV1.put('/admin/resources/resource/:resourceId', adminUpdateResource);

routerV1.post('/admin/marker/monster/create', adminCreateMonsterMarker);
routerV1.put('/admin/marker/monster/:markerId', adminUpdateMonsterMarker);
routerV1.delete('/admin/marker/monster/:markerId', adminDeleteMonsterMarker);

routerV1.post('/admin/marker/resource/create', adminCreateResourceMarker);
routerV1.put('/admin/marker/resource/:markerId', adminUpdateResourceMarker);
routerV1.delete('/admin/marker/resource/:markerId', adminDeleteResourceMarker);

routerV1.put(
  '/admin/monsters/monster/:monsterId/drops',
  adminUpdateMonsterDrops,
);

routerV1.put('/admin/settings/update', adminUpdateSettings);

/*****************************
 *         RESOURCES         *
 *****************************/

import { getResources } from './resources';

routerV1.get('/resources/list', getResources);

/****************************
 *         MONSTERS         *
 ****************************/

import { getMonsters } from './monsters';

routerV1.get('/monsters/list', getMonsters);

/*************************
 *         ITEMS         *
 *************************/

import {
  getItems,
  getItemActions,
  getItemCrafts,
  getItemStats,
  getItemCraftingList,
} from './items';

routerV1.get('/items/list', getItems);
routerV1.get('/items/item/:itemId/actions', getItemActions);
routerV1.get('/items/item/:itemId/crafts', getItemCrafts);
routerV1.get('/items/item/:itemId/stats', getItemStats);
routerV1.get('/users/user/:userId/craft/:itemId', getItemCraftingList);

/*************************
 *         DROPS         *
 *************************/

import {
  getMonsterDrops,
  getMonsterDropsForUser,
  getDropsByMonsterId,
  getResourceDrops,
  getResourceDropsForUser,
  getDropsByResourceId,
} from './drops';

routerV1.get('/drops/monster/list', getMonsterDrops);
routerV1.get('/drops/monster/:monsterId', getDropsByMonsterId);
routerV1.put('/drops/monster/user/:userId', getMonsterDropsForUser);

routerV1.get('/drops/resource/list', getResourceDrops);
routerV1.get('/drops/resource/:resourceId', getDropsByResourceId);
routerV1.put('/drops/resource/user/:userId', getResourceDropsForUser);

/************************
 *         USER         *
 ************************/

import {
  getUser,
  getUserAchievements,
  getUserItems,
  getUserLoadout,
  getUserMaterials,
  getUserWealth,
  getUserStats,
  getUserHealth,
  getUserEquipItem,
  updateUserExp,
  updateUserHealth,
  updateUserWealth,
  updateUserAchievement,
  updateUserItemCraft,
  updateUserItemsConsume,
} from './users';

routerV1.get('/users/user/:userId', getUser);
routerV1.get('/users/user/:userId/achievements/list', getUserAchievements);
routerV1.get('/users/user/:userId/items/list', getUserItems);
routerV1.get('/users/user/:userId/loadout/list', getUserLoadout);
routerV1.get('/users/user/:userId/materials/list', getUserMaterials);
routerV1.get('/users/user/:userId/wealth/list', getUserWealth);
routerV1.get('/users/user/:userId/stats', getUserStats);
routerV1.get('/users/user/:userId/item/:itemId/equip', getUserEquipItem);

routerV1.get('/users/user/:userId/health', getUserHealth);
routerV1.put('/users/user/:userId/health', updateUserHealth);
routerV1.put('/users/user/:userId/achievement', updateUserAchievement);

routerV1.put('/users/user/:userId/wealth', updateUserWealth);
routerV1.put('/users/user/:userId/exp', updateUserExp);
routerV1.put('/users/user/:userId/consume', updateUserItemsConsume);
routerV1.put('/users/user/:userId/craft/:itemId', updateUserItemCraft);

/****************************
 *         MAP         *
 ****************************/

import {
  getSingleMonsterMarker,
  getAllMonsterMarkers,
  getAllResourceMarkers,
  getMonsterMarkersByUserId,
  getResourceMarkersByUserId,
} from './markers';

routerV1.get('/map/markers/monsters/list', getAllMonsterMarkers);
routerV1.get('/map/markers/resources/list', getAllResourceMarkers);
routerV1.get('/map/markers/monsters/:markerId', getSingleMonsterMarker);
routerV1.get('/map/monsters/user/:userId', getMonsterMarkersByUserId);
routerV1.get('/map/resources/user/:userId', getResourceMarkersByUserId);

/*****************************
 *         MATERIALS         *
 *****************************/

import { getMaterials } from './materials';

routerV1.get('/materials/list', getMaterials);

/****************************
 *         HABITATS         *
 ****************************/

import { getHabitats } from './habitats';

routerV1.get('/habitats/list', getHabitats);

/********************************
 *         ACHIEVEMENTS         *
 ********************************/

import { getAchievements } from './achievements';

routerV1.get('/achievements/list', getAchievements);

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
