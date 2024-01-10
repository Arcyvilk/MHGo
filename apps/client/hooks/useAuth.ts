import { useLoginApi, useLogoutApi, useMeApi } from '@mhgo/front';
import { useAppContext } from '../utils/context';

export const useMe = () => {
  const { isLoggedIn, setIsLoggedIn, setBearerToken } = useAppContext();
  const { mutate: mutateLogin, isPending } = useLoginApi(
    setIsLoggedIn,
    setBearerToken,
  );
  const { mutate: mutateLogout } = useLogoutApi(setIsLoggedIn, setBearerToken);
  const { data: userAuthData } = useMeApi();

  const loginUser = (userName: string, pwd: string) => {
    mutateLogin({ userName, pwd });
  };

  const logoutUser = () => {
    mutateLogout();
  };

  return {
    ...userAuthData,
    loginUser,
    logoutUser,
    isPending,
    isLoggedIn: isLoggedIn.loggedIn,
  };
};
