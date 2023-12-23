import { userData } from '../_mock/save';
import { EXP_PER_LEVEL, USER_ID, USER_NAME } from '../_mock/settings';

export const useUser = () => {
  const userId = USER_ID;
  const userName = USER_NAME;

  const user = userData.find(u => u.userId === userId);

  const userArcyId = userName.toLowerCase().replace(' ', '_').concat('666');
  const userExp = (user?.exp ?? 0) % EXP_PER_LEVEL;
  const userLevel = 1 + Math.floor((user?.exp ?? 0) / EXP_PER_LEVEL);

  return { userId, userName, userExp, userLevel, userArcyId };
};
