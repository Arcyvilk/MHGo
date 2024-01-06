import { useUpdateUserExpApi } from '@mhgo/front';

export const useUserLevelUp = (userId: string) => {
  const { mutate, data: levels } = useUpdateUserExpApi(userId);

  const didLevelUp = (levels?.newLevel ?? 0) > (levels?.oldLevel ?? 0);

  return { mutate, levels, didLevelUp };
};
