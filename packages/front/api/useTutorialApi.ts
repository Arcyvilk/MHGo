import { useQuery } from '@tanstack/react-query';
import { TutorialStep } from '@mhgo/types';

import { API_URL } from '../env';
import { addCdnUrl, fetcher } from '..';

export type TutorialPart = {
  tutorial: TutorialStep[];
  nextPartId: string | null;
};
export const useTutorialApi = (stepFrom?: string, stepTo?: string) => {
  const getTutorial = async (): Promise<TutorialPart> => {
    const res = await fetcher(
      `${API_URL}/tutorial?stepFrom=${stepFrom}&stepTo=${stepTo}`,
    );
    return res.json();
  };

  const {
    data: tutorials = { tutorial: [], nextPartId: null },
    isLoading,
    isFetched,
    isError,
  } = useQuery<TutorialPart, unknown, TutorialPart, string[]>({
    queryKey: ['tutorial', `from-${stepFrom}_to-${stepTo}`],
    queryFn: getTutorial,
    staleTime: Infinity,
  });

  const data = {
    ...tutorials,
    tutorial: tutorials.tutorial.map(t => ({
      ...t,
      ...(t.img ? { img: addCdnUrl(t.img) } : {}),
    })),
  };

  return { data, isLoading, isFetched, isError };
};
