import { useQuery } from '@tanstack/react-query';
import { FieldByRarity } from '@mhgo/types';

import { API_URL } from '../utils/consts';

/**
 *
 * @returns
 */
export const useRarityMaterialsApi = () => {
  const getRarityMaterials = async (): Promise<FieldByRarity[]> => {
    const res = await fetch(`${API_URL}/materials/rarity/list`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<FieldByRarity[], unknown, FieldByRarity[], string[]>({
    queryKey: ['materials', 'rarity'],
    queryFn: getRarityMaterials,
  });

  return { data, isLoading, isFetched, isError };
};
