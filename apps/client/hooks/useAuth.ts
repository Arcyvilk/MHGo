import { useLoginApi, useMeApi } from '@mhgo/front';

export const useMe = () => {
  const { mutate: mutateLogin, isLoggedIn, isPending } = useLoginApi();
  const { data: userAuthData } = useMeApi();

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
