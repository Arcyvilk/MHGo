import { Request, Response } from 'express';

import { log } from '@mhgo/utils';
import {
  Achievement,
  Companion,
  Biome,
  Item,
  Material,
  Monster,
  Resource,
  TutorialStep,
} from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getPrefetchImages = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);
    const images: string[] = [...hardcodedUrls];

    // All collections including images
    const collectionAchievements = db.collection<Achievement>('achievements');
    const collectionCompanions = db.collection<Companion>('companions');
    const collectionBiomes = db.collection<Biome>('biomes');
    const collectionItems = db.collection<Item>('items');
    const collectionMaterials = db.collection<Material>('materials');
    const collectionMonsters = db.collection<Monster>('monsters');
    const collectionResources = db.collection<Resource>('resources');
    const collectionTutorial = db.collection<TutorialStep>('tutorial');

    const cursorAchievements = collectionAchievements.find();
    const cursorCompanions = collectionCompanions.find();
    const cursorBiomes = collectionBiomes.find();
    const cursorItems = collectionItems.find();
    const cursorMaterials = collectionMaterials.find();
    const cursorMonsters = collectionMonsters.find();
    const cursorResources = collectionResources.find();
    const cursorTutorial = collectionTutorial.find({ img: { $ne: null } });

    for await (const el of cursorAchievements) images.push(el.img);
    for await (const el of cursorBiomes) images.push(el.image);
    for await (const el of cursorItems) images.push(el.img);
    for await (const el of cursorMaterials) images.push(el.img);
    for await (const el of cursorResources) images.push(el.img);
    for await (const el of cursorTutorial) images.push(el.img);
    for await (const el of cursorCompanions) {
      images.push(el.img_full_happy);
      images.push(el.img_full_idle);
      images.push(el.img_happy);
      images.push(el.img_idle);
      images.push(el.img_surprised);
    }
    for await (const el of cursorMonsters) {
      images.push(el.img);
      images.push(el.thumbnail);
    }

    res.status(200).send(images);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

const hardcodedUrls = [
  '/misc/avatar_nobg.png',
  '/misc/claimed.png',
  '/misc/extinct.png',
  '/misc/hunter.jpg',
  '/misc/qr.jpg',
  '/misc/question.svg',
  '/misc/sad_palico.png',
];
