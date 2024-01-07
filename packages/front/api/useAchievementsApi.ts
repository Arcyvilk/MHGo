import { useQuery } from '@tanstack/react-query';
import { Achievement } from '@mhgo/types';

import { API_URL } from '../env';
import { addCdnUrl } from '..';

/**
 *
 * @returns
 */
export const useAchievementsApi = () => {
  const getAchievements = async (): Promise<Achievement[]> => {
    const res = await fetch(`${API_URL}/achievements/list`);
    return res.json();
  };

  const {
    data: achievements = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<Achievement[], unknown, Achievement[], string[]>({
    queryKey: ['achievements'],
    queryFn: getAchievements,
  });

  const data = achievements.map(achievement => ({
    ...achievement,
    img: addCdnUrl(achievement.img),
  }));

  return { data, isLoading, isFetched, isError };
};
