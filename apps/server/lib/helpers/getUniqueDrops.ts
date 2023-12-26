import { CraftType, Item as TItem, Material } from '@mhgo/types';

export const getUniqueMaterialDrops = (
  allDrops: { id: string; type: CraftType }[],
  materials: Material[],
) => {
  const allMaterialDrops = allDrops.filter(drop => drop.type === 'material');
  const uniqueMaterialDropIds = [
    ...new Set(allMaterialDrops.map(drop => drop.id)),
  ];

  const materialDrops = uniqueMaterialDropIds
    .map(uniqueDropId => {
      const material = materials.find(m => m.id === uniqueDropId);
      const amount =
        allMaterialDrops.filter(dropId => dropId.id === uniqueDropId).length ??
        0;
      return {
        ...material,
        dropClass: 'material',
        amount,
      };
    })
    .filter(Boolean) as (Material & { dropClass: CraftType; amount: number })[];

  return materialDrops;
};

export const getUniqueItemDrops = (
  allDrops: { id: string; type: CraftType }[],
  items: TItem[],
) => {
  const allItemDrops = allDrops.filter(drop => drop.type === 'item');
  const uniqueItemDropIds = [...new Set(allItemDrops.map(drop => drop.id))];
  const itemDrops = uniqueItemDropIds
    .map(uniqueDropId => {
      const item = items.find(i => i.id === uniqueDropId);
      const amount =
        allItemDrops.filter(dropId => dropId.id === uniqueDropId).length ?? 0;
      return {
        ...item,
        dropClass: 'item',
        amount,
      };
    })
    .filter(Boolean) as (TItem & { dropClass: CraftType; amount: number })[];

  return itemDrops;
};
