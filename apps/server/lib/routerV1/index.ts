import express from 'express';
// import { apiV1Auth } from '../helpers/validate';

export const routerV1 = express.Router();

/*****************************
 *         LOGIN         *
 *****************************/

import {
  getMe,
  login,
  update,
  logout,
  signIn,
  verifyToken,
  verifyAdminToken,
} from './auth';

routerV1.get('/auth/me', verifyToken, validateAdventure, getMe);
routerV1.post('/auth/signIn', signIn);
routerV1.post('/auth/login', login);
routerV1.post('/auth/update', verifyToken, validateAdventure, update);
routerV1.get('/auth/logout', logout);

/********************************
 *         ADMIN ROUTES         *
 ********************************/

import {
  adminGetAllUsers,
  adminUpdateUser,
  adminResetUser,
  adminDeleteUser,
  adminUserEnableGodmode,
  adminCreateItem,
  adminCreateMaterial,
  adminCreateMonster,
  adminUpdateItem,
  adminUpdateItemAction,
  adminUpdateItemCrafts,
  adminUpdateItemPrice,
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

routerV1.get(
  '/admin/users/list',
  verifyAdminToken,
  validateAdventure,
  adminGetAllUsers,
);
routerV1.put(
  '/admin/users/user/:userId',
  verifyAdminToken,
  validateAdventure,
  adminUpdateUser,
);
routerV1.put(
  '/admin/users/user/:userId/reset',
  verifyAdminToken,
  adminResetUser,
);
routerV1.post(
  '/admin/users/user/:userId/godmode',
  verifyAdminToken,
  adminUserEnableGodmode,
);
routerV1.delete(
  '/admin/users/user/:userId',
  verifyAdminToken,
  validateAdventure,
  adminDeleteUser,
);

routerV1.post(
  '/admin/items/create',
  verifyAdminToken,
  validateAdventure,
  adminCreateItem,
);
routerV1.post(
  '/admin/materials/create',
  verifyAdminToken,
  validateAdventure,
  adminCreateMaterial,
);
routerV1.post(
  '/admin/monsters/create',
  verifyAdminToken,
  validateAdventure,
  adminCreateMonster,
);
routerV1.post(
  '/admin/resources/create',
  verifyAdminToken,
  validateAdventure,
  adminCreateResource,
);

routerV1.put(
  '/admin/items/item/:itemId',
  verifyAdminToken,
  validateAdventure,
  adminUpdateItem,
);
routerV1.put(
  '/admin/items/item/:itemId/action',
  verifyAdminToken,
  adminUpdateItemAction,
);
routerV1.put(
  '/admin/items/item/:itemId/crafts',
  verifyAdminToken,
  adminUpdateItemCrafts,
);
routerV1.put(
  '/admin/items/item/:itemId/price',
  verifyAdminToken,
  adminUpdateItemPrice,
);
routerV1.put(
  '/admin/items/item/:itemId/stats',
  verifyAdminToken,
  adminUpdateItemStats,
);

routerV1.put(
  '/admin/materials/material/:materialId',
  verifyAdminToken,
  adminUpdateMaterial,
);
routerV1.put(
  '/admin/monsters/monster/:monsterId',
  verifyAdminToken,
  adminUpdateMonster,
);
routerV1.put(
  '/admin/resources/resource/:resourceId',
  verifyAdminToken,
  adminUpdateResource,
);

routerV1.post(
  '/admin/marker/monster/create',
  verifyAdminToken,
  adminCreateMonsterMarker,
);
routerV1.put(
  '/admin/marker/monster/:markerId',
  verifyAdminToken,
  adminUpdateMonsterMarker,
);
routerV1.delete(
  '/admin/marker/monster/:markerId',
  verifyAdminToken,
  adminDeleteMonsterMarker,
);

routerV1.post(
  '/admin/marker/resource/create',
  verifyAdminToken,
  adminCreateResourceMarker,
);
routerV1.put(
  '/admin/marker/resource/:markerId',
  verifyAdminToken,
  adminUpdateResourceMarker,
);
routerV1.delete(
  '/admin/marker/resource/:markerId',
  verifyAdminToken,
  adminDeleteResourceMarker,
);

routerV1.put(
  '/admin/monsters/monster/:monsterId/drops',
  verifyAdminToken,
  adminUpdateMonsterDrops,
);

routerV1.put(
  '/admin/settings/update',
  verifyAdminToken,
  validateAdventure,
  adminUpdateSettings,
);

/*****************************
 *         RESOURCES         *
 *****************************/

import { getResources } from './resources';

routerV1.get('/resources/list', verifyToken, validateAdventure, getResources);

/****************************
 *         MONSTERS         *
 ****************************/

import { getMonsters } from './monsters';

routerV1.get('/monsters/list', verifyToken, validateAdventure, getMonsters);

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

routerV1.get('/items/list', verifyToken, validateAdventure, getItems);
routerV1.get(
  '/items/item/:itemId/actions',
  verifyToken,
  validateAdventure,
  getItemActions,
);
routerV1.get(
  '/items/item/:itemId/crafts',
  verifyToken,
  validateAdventure,
  getItemCrafts,
);
routerV1.get(
  '/items/item/:itemId/price',
  verifyToken,
  validateAdventure,
  getItemPrice,
);
routerV1.get(
  '/items/item/:itemId/stats',
  verifyToken,
  validateAdventure,
  getItemStats,
);
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

routerV1.get(
  '/drops/monster/list',
  verifyToken,
  validateAdventure,
  getMonsterDrops,
);
routerV1.get(
  '/drops/monster/:monsterId',
  verifyToken,
  validateAdventure,
  getDropsByMonsterId,
);
routerV1.put(
  '/drops/monster/user/:userId',
  verifyToken,
  getMonsterDropsForUser,
);

routerV1.get(
  '/drops/resource/list',
  verifyToken,
  validateAdventure,
  getResourceDrops,
);
routerV1.get(
  '/drops/resource/:resourceId',
  verifyToken,
  validateAdventure,
  getDropsByResourceId,
);
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
  getUserCraftableItems,
  getUserLoadout,
  getUserMaterials,
  getUserWealth,
  getUserStats,
  getUserHealth,
  getUserEquipItem,
  getUserDailyQuests,
  getUserStoryQuests,
  updateUserExp,
  updateUserHealth,
  updateUserWealth,
  updateUserAchievement,
  updateUserDailyQuests,
  updateUserStoryQuests,
  updateUserItems,
  updateUserItemCraft,
  updateUserItemsConsume,
  updateUserItemPurchase,
} from './users';

routerV1.get('/users/user/:userId', verifyToken, validateAdventure, getUser);
routerV1.get(
  '/users/user/:userId/achievements/list',
  verifyToken,
  getUserAchievements,
);
routerV1.get(
  '/users/user/:userId/items/list',
  verifyToken,
  validateAdventure,
  getUserItems,
);
routerV1.get(
  '/users/user/:userId/items/craftable',
  verifyToken,
  getUserCraftableItems,
);
routerV1.get(
  '/users/user/:userId/loadout/list',
  verifyToken,
  validateAdventure,
  getUserLoadout,
);
routerV1.get(
  '/users/user/:userId/materials/list',
  verifyToken,
  getUserMaterials,
);
routerV1.get(
  '/users/user/:userId/wealth/list',
  verifyToken,
  validateAdventure,
  getUserWealth,
);
routerV1.get(
  '/users/user/:userId/stats',
  verifyToken,
  validateAdventure,
  getUserStats,
);
routerV1.get(
  '/users/user/:userId/item/:itemId/equip',
  verifyToken,
  getUserEquipItem,
);

routerV1.get(
  '/users/user/:userId/health',
  verifyToken,
  validateAdventure,
  getUserHealth,
);
routerV1.put(
  '/users/user/:userId/health',
  verifyToken,
  validateAdventure,
  updateUserHealth,
);
routerV1.put(
  '/users/user/:userId/achievement',
  verifyToken,
  updateUserAchievement,
);

routerV1.get(
  '/users/user/:userId/quests/daily',
  verifyToken,
  getUserDailyQuests,
);
routerV1.get(
  '/users/user/:userId/quests/story',
  verifyToken,
  getUserStoryQuests,
);
routerV1.put(
  '/users/user/:userId/quests/daily/:questId',
  verifyToken,
  updateUserDailyQuests,
);
routerV1.put(
  '/users/user/:userId/quests/story/:questId',
  verifyToken,
  updateUserStoryQuests,
);

routerV1.put(
  '/users/user/:userId/wealth',
  verifyToken,
  validateAdventure,
  updateUserWealth,
);
routerV1.put(
  '/users/user/:userId/exp',
  verifyToken,
  validateAdventure,
  updateUserExp,
);
routerV1.put(
  '/users/user/:userId/items',
  verifyToken,
  validateAdventure,
  updateUserItems,
);
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

/***********************
 *         MAP         *
 ***********************/

import {
  getSingleMonsterMarker,
  getAllMonsterMarkers,
  getAllResourceMarkers,
  getSingleResourceMarker,
  getMonsterMarkersByUserId,
  getResourceMarkersByUserId,
} from './markers';

// This endpoint must be on top otherwise "list" will be treated as ":markerId"
routerV1.get(
  '/map/markers/monsters/list',
  verifyToken,
  validateAdventure,
  getAllMonsterMarkers,
);
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

// This endpoint must be on top otherwise "list" will be treated as ":markerId"
routerV1.get(
  '/map/markers/resources/list',
  verifyToken,
  validateAdventure,
  getAllResourceMarkers,
);
routerV1.get(
  '/map/markers/resources/:markerId',
  verifyToken,
  getSingleResourceMarker,
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

routerV1.get('/materials/list', verifyToken, validateAdventure, getMaterials);

/****************************
 *         HABITATS         *
 ****************************/

import { getHabitats } from './habitats';

routerV1.get('/habitats/list', verifyToken, validateAdventure, getHabitats);

/**************************
 *         QUESTS         *
 **************************/

import { getQuestsDaily, getQuestsStory } from './quests';

routerV1.get(
  '/quests/daily/list',
  verifyToken,
  validateAdventure,
  getQuestsDaily,
);
routerV1.get(
  '/quests/story/list',
  verifyToken,
  validateAdventure,
  getQuestsStory,
);

/********************************
 *         ACHIEVEMENTS         *
 ********************************/

import { getAchievements } from './achievements';

routerV1.get(
  '/achievements/list',
  verifyToken,
  validateAdventure,
  getAchievements,
);

/******************************
 *         COMPANIONS         *
 ******************************/

import { getCompanionById } from './companions';

routerV1.get(
  '/companions/companion/:companionId',
  verifyToken,
  getCompanionById,
);

/************************
 *         NEWS         *
 ************************/

import { getNews } from './news';

routerV1.get('/news/list', verifyToken, validateAdventure, getNews);

/****************************
 *         TUTORIAL         *
 ****************************/

import { getTutorial } from './tutorial';

routerV1.get('/tutorial', verifyToken, validateAdventure, getTutorial);

/****************************
 *         SETTINGS         *
 ****************************/

import { getSettings } from './settings';

routerV1.get('/settings', verifyToken, validateAdventure, getSettings);

/************************
 *         MISC         *
 ************************/

import { getPrefetchImages } from './_misc';
import { validateAdventure } from '../helpers/validateAdventure';

routerV1.get(
  '/misc/prefetch/images',
  verifyToken,
  validateAdventure,
  getPrefetchImages,
);
