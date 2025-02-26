import { useSuspenseQuery } from '@tanstack/react-query';
import { Biome } from '@mhgo/types';

import { API_URL } from '../env';
import { addCdnUrl, fetcher } from '..';

/**
 *
 * @returns
 */
export const useBiomesApi = () => {
  const getBiomes = async (): Promise<Biome[]> => {
    const res = await fetcher(`${API_URL}/biomes/list`);
    return res.json();
  };

  const {
    data: biomes = [],
    isLoading,
    isFetched,
    isError,
  } = useSuspenseQuery<Biome[], unknown, Biome[], string[]>({
    queryKey: ['biomes'],
    queryFn: getBiomes,
  });

  const data = biomes.map(biome => ({
    ...biome,
    image: addCdnUrl(biome.image),
  }));

  return { data, isLoading, isFetched, isError };
};
