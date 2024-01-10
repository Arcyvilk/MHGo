import express from 'express';
// import { apiV1Auth } from '../helpers/validate';

export const routerV1 = express.Router();

// TODO ADD API AUTH TO ALL ROUTES IN PROD!!!!

/*****************************
 *         LOGIN         *
 *****************************/

import { getMe, login, update, logout, signIn, verifyToken } from './auth';

routerV1.get('/auth/me', verifyToken, getMe);
routerV1.post('/auth/signIn', signIn);
routerV1.post('/auth/login', login);
routerV1.post('/auth/update', verifyToken, update);
routerV1.get('/auth/logout', verifyToken, logout);

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

routerV1.get('/admin/users/list', verifyToken, adminGetAllUsers);
routerV1.put('/admin/users/user/:userId', verifyToken, adminUpdateUser);
routerV1.put('/admin/users/user/:userId/reset', verifyToken, adminResetUser);
routerV1.post(
  '/admin/users/user/:userId/godmode',
  verifyToken,
  adminUserEnableGodmode,
);

routerV1.post('/admin/items/create', verifyToken, adminCreateItem);
routerV1.post('/admin/materials/create', verifyToken, adminCreateMaterial);
routerV1.post('/admin/monsters/create', verifyToken, adminCreateMonster);
routerV1.post('/admin/resources/create', verifyToken, adminCreateResource);

routerV1.put('/admin/items/item/:itemId', verifyToken, adminUpdateItem);
routerV1.put(
  '/admin/items/item/:itemId/action',
  verifyToken,
  adminUpdateItemAction,
);
routerV1.put(
  '/admin/items/item/:itemId/crafts',
  verifyToken,
  adminUpdateItemCrafts,
);
routerV1.put(
  '/admin/items/item/:itemId/stats',
  verifyToken,
  adminUpdateItemStats,
);

routerV1.put(
  '/admin/materials/material/:materialId',
  verifyToken,
  adminUpdateMaterial,
);
routerV1.put(
  '/admin/monsters/monster/:monsterId',
  verifyToken,
  adminUpdateMonster,
);
routerV1.put(
  '/admin/resources/resource/:resourceId',
  verifyToken,
  adminUpdateResource,
);

routerV1.post(
  '/admin/marker/monster/create',
  verifyToken,
  adminCreateMonsterMarker,
);
routerV1.put(
  '/admin/marker/monster/:markerId',
  verifyToken,
  adminUpdateMonsterMarker,
);
routerV1.delete(
  '/admin/marker/monster/:markerId',
  verifyToken,
  adminDeleteMonsterMarker,
);

routerV1.post(
  '/admin/marker/resource/create',
  verifyToken,
  adminCreateResourceMarker,
);
routerV1.put(
  '/admin/marker/resource/:markerId',
  verifyToken,
  adminUpdateResourceMarker,
);
routerV1.delete(
  '/admin/marker/resource/:markerId',
  verifyToken,
  adminDeleteResourceMarker,
);

routerV1.put(
  '/admin/monsters/monster/:monsterId/drops',
  adminUpdateMonsterDrops,
);

routerV1.put('/admin/settings/update', verifyToken, adminUpdateSettings);

/*****************************
 *         RESOURCES         *
 *****************************/

import { getResources } from './resources';

routerV1.get('/resources/list', verifyToken, getResources);

/****************************
 *         MONSTERS         *
 ****************************/

import { getMonsters } from './monsters';

routerV1.get('/monsters/list', verifyToken, getMonsters);

/*************************
 *         ITEMS         *
 *************************/

import {
  getItems,
  getItemActions,
  getItemCrafts,
  getItemPrice,
  getItemStats,
  getItemCraftingList,
} from './items';

routerV1.get('/items/list', verifyToken, getItems);
routerV1.get('/items/item/:itemId/actions', verifyToken, getItemActions);
routerV1.get('/items/item/:itemId/crafts', verifyToken, getItemCrafts);
routerV1.get('/items/item/:itemId/price', verifyToken, getItemPrice);
routerV1.get('/items/item/:itemId/stats', verifyToken, getItemStats);
routerV1.get(
  '/users/user/:userId/craft/:itemId',
  verifyToken,
  getItemCraftingList,
);

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

routerV1.get('/drops/monster/list', verifyToken, getMonsterDrops);
routerV1.get('/drops/monster/:monsterId', verifyToken, getDropsByMonsterId);
routerV1.put(
  '/drops/monster/user/:userId',
  verifyToken,
  getMonsterDropsForUser,
);

routerV1.get('/drops/resource/list', verifyToken, getResourceDrops);
routerV1.get('/drops/resource/:resourceId', verifyToken, getDropsByResourceId);
routerV1.put(
  '/drops/resource/user/:userId',
  verifyToken,
  getResourceDropsForUser,
);

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
  updateUserItemPurchase,
} from './users';

routerV1.get('/users/user/:userId', verifyToken, getUser);
routerV1.get(
  '/users/user/:userId/achievements/list',
  verifyToken,
  getUserAchievements,
);
routerV1.get('/users/user/:userId/items/list', verifyToken, getUserItems);
routerV1.get('/users/user/:userId/loadout/list', verifyToken, getUserLoadout);
routerV1.get(
  '/users/user/:userId/materials/list',
  verifyToken,
  getUserMaterials,
);
routerV1.get('/users/user/:userId/wealth/list', verifyToken, getUserWealth);
routerV1.get('/users/user/:userId/stats', verifyToken, getUserStats);
routerV1.get(
  '/users/user/:userId/item/:itemId/equip',
  verifyToken,
  getUserEquipItem,
);

routerV1.get('/users/user/:userId/health', verifyToken, getUserHealth);
routerV1.put('/users/user/:userId/health', verifyToken, updateUserHealth);
routerV1.put(
  '/users/user/:userId/achievement',
  verifyToken,
  updateUserAchievement,
);

routerV1.put('/users/user/:userId/wealth', verifyToken, updateUserWealth);
routerV1.put('/users/user/:userId/exp', verifyToken, updateUserExp);
routerV1.put(
  '/users/user/:userId/consume',
  verifyToken,
  updateUserItemsConsume,
);
routerV1.put(
  '/users/user/:userId/craft/:itemId',
  verifyToken,
  updateUserItemCraft,
);
routerV1.put(
  '/users/user/:userId/purchase/:itemId',
  verifyToken,
  updateUserItemPurchase,
);

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

routerV1.get('/map/markers/monsters/list', verifyToken, getAllMonsterMarkers);
routerV1.get('/map/markers/resources/list', verifyToken, getAllResourceMarkers);
routerV1.get(
  '/map/markers/monsters/:markerId',
  verifyToken,
  getSingleMonsterMarker,
);
routerV1.get(
  '/map/monsters/user/:userId',
  verifyToken,
  getMonsterMarkersByUserId,
);
routerV1.get(
  '/map/resources/user/:userId',
  verifyToken,
  getResourceMarkersByUserId,
);

/*****************************
 *         MATERIALS         *
 *****************************/

import { getMaterials } from './materials';

routerV1.get('/materials/list', verifyToken, getMaterials);

/****************************
 *         HABITATS         *
 ****************************/

import { getHabitats } from './habitats';

routerV1.get('/habitats/list', verifyToken, getHabitats);

/********************************
 *         ACHIEVEMENTS         *
 ********************************/

import { getAchievements } from './achievements';

routerV1.get('/achievements/list', verifyToken, getAchievements);

/************************
 *         NEWS         *
 ************************/

import { getNews } from './news';

routerV1.get('/news/list', verifyToken, getNews);

/****************************
 *         SETTINGS         *
 ****************************/

import { getSettings } from './settings';

routerV1.get('/settings', verifyToken, getSettings);
