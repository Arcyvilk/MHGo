import { Db } from 'mongodb';
import { Material, RarityFilter, Setting } from '@mhgo/types';

export const addFilterToMaterials = async (db: Db, materials: Material[]) => {
  const collectionSettings = db.collection<Setting<RarityFilter[]>>('settings');
  const { value: filters } = await collectionSettings.findOne({
    key: 'rarity_filters',
  });

  const materialsWithFilter = materials.map(material => ({
    ...material,
    filter: filters.find(f => f.rarity === material.rarity)?.filter ?? '',
  }));

  return materialsWithFilter;
};
