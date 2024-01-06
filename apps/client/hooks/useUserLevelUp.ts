import { useUpdateUserExpApi } from '@mhgo/front';
import { toast } from 'react-toastify';

export const useUserLevelUp = (userId: string) => {
  const { mutate, data: levels } = useUpdateUserExpApi(userId);

  const didLevelUp = (levels?.newLevel ?? 0) > (levels?.oldLevel ?? 0);

  if (didLevelUp) toast.success('You levelled up!');

  return { mutate, levels, didLevelUp };
};
