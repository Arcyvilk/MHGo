import { useLoginApi, useUserAuth } from '@mhgo/front';
import { useUser } from './useUser';

export const useAuth = () => {
  const { userId } = useUser();
  const { mutate: mutateLogin, isLoggedIn, isPending } = useLoginApi();
  const { data: userAuthData } = useUserAuth(userId);

  const loginUser = (userName: string, pwd: string) => {
    mutateLogin({ userName, pwd });
  };

  return {
    loginUser,
    isLoggedIn,
    isPending,
    ...userAuthData,
  };
};
