import { Material, RarityFilter, Setting } from '@mhgo/types';

import { mongoInstance } from '../../api';

export const addFilterToMaterials = async (materials: Material[]) => {
  const { db } = mongoInstance.getDb(res.locals.adventure);
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
