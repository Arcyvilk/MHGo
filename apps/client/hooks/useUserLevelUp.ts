import { useUpdateUserExpApi } from '@mhgo/front';
import { UserLevelUpdate } from '@mhgo/types';

export const useUserLevelUp = (userId: string) => {
  const { mutate, data: levels } = useUpdateUserExpApi(userId);
  const didLevelUp = getDidLevelUp(levels);

  return { mutate, levels, didLevelUp };
};

export const getDidLevelUp = (levels: UserLevelUpdate | undefined) => {
  const didLevelUp = (levels?.newLevel ?? 0) > (levels?.oldLevel ?? 0);
  return { didLevelUp };
};
