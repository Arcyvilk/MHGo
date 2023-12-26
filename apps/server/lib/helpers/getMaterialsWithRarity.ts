import { FieldByRarity, Material } from '@mhgo/types';

// TODO Move to settings
export const rarityList = [1, 2, 3, 4, 5];

export const getMaterialsWithRarity = (
  materials: Material[],
  rarityMaterials: FieldByRarity[],
) => {
  const materialsWithRarity = rarityList
    .map(rarity =>
      materials.map(material => {
        const fieldByRarity =
          rarityMaterials.find(field => field?.rarity === rarity) ??
          rarityMaterials[0];
        return {
          ...material,
          rarity,
          id: `${material.id}${rarity}`,
          name: `${fieldByRarity?.prefix} ${material.name}`,
          filter: fieldByRarity?.filter,
          description: fieldByRarity?.description?.replace('%', material.name),
        };
      }),
    )
    .flat();

  return materialsWithRarity;
};
