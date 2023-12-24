import { useMaterialsApi } from '../api/useMaterialsApi';
import { useRarityMaterialsApi } from '../api/useRarityMaterialsApi';

const rarityList = [1, 2, 3, 4, 5];

export const useMaterials = () => {
  const { data: materials } = useMaterialsApi();
  const { data: rarityMaterials } = useRarityMaterialsApi();

  const materialsWithRarity = rarityList
    .map(rarity =>
      materials.map(material => {
        const fieldByRarity =
          rarityMaterials.find(field => field?.rarity === rarity) ??
          rarityMaterials[0];
        return {
          ...material,
          id: `${material.id}${rarity}`,
          name: `${fieldByRarity.prefix} ${material.name}`,
          filter: fieldByRarity.filter,
          description: fieldByRarity.description.replace('%', material.name),
        };
      }),
    )
    .flat();

  return { materials: materialsWithRarity };
};
