import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
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

// Approve all changes for the affected entity
export const useAdminApproveChanges = () => {
  const queryClient = useQueryClient();

  const adminApproveChanges = async (
    affectedEntityId: string,
  ): Promise<void> => {
    const response = await fetcher(
      `${API_URL}/admin/misc/review/${affectedEntityId}`,
      {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status !== 200 && response.status !== 201)
      throw new Error((await response.json()).error ?? 'Did not work!');
    queryClient.invalidateQueries({ queryKey: ['admin', 'review', 'all'] });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'reviee', 'delete'],
    mutationFn: adminApproveChanges,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};
