import { useSuspenseQuery } from '@tanstack/react-query';
import { ChangeReview } from '@mhgo/types';

import { API_URL } from '../../env';
import { fetcher } from '../..';

type ChangeReviewAggregated = {
  affectedEntityId: string;
  documents: ChangeReview[];
};
export const useAdminChangeReviewApi = () => {
  const getChangeReview = async (): Promise<ChangeReviewAggregated[]> => {
    const res = await fetcher(`${API_URL}/admin/misc/review`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useSuspenseQuery<
    ChangeReviewAggregated[],
    unknown,
    ChangeReviewAggregated[],
    string[]
  >({
    queryKey: ['admin', 'review', 'all'],
    queryFn: getChangeReview,
  });

  return { data, isLoading, isFetched, isError };
};
