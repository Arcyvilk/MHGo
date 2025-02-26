import { PackType, StarterPack } from '@mhgo/types';
import { mongoInstance } from '../../api';

export const getStarterPack = async (adventure: string, packType: PackType) => {
  const { db } = mongoInstance.getDb(adventure);

  const collectionStarterPack = db.collection<StarterPack>('starterPack');
  const packs = await collectionStarterPack.find({ packType }).toArray();

  return packs ?? [];
};
