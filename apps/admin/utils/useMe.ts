import { useLoginApi, useLogoutApi, useMeApi, useSignInApi } from '@mhgo/front';
import { useAppContext } from './context';

export const useMe = () => {
  const { isLoggedIn, setIsLoggedIn, setBearerToken } = useAppContext();
  const { mutate: mutateLogin, isPending: isLoginPending } = useLoginApi(
    setIsLoggedIn,
    setBearerToken,
  );
  const { mutate: mutateLogout } = useLogoutApi(setIsLoggedIn, setBearerToken);
  const { mutate: mutateSignIn, isPending: isSigninPending } = useSignInApi(
    setIsLoggedIn,
    setBearerToken,
  );
  const { data: userAuthData } = useMeApi();

  const loginUser = (userName: string, pwd: string) => {
    mutateLogin({ userName, pwd });
  };

  const logoutUser = () => {
    mutateLogout();
  };

  const signinUser = (signinData: {
    userName: string;
    email: string;
    pwd: string;
  }) => {
    mutateSignIn(signinData);
  };

  return {
    ...userAuthData,
    loginUser,
    logoutUser,
    signinUser,
    isLoginPending,
    isSigninPending,
    isPending: isLoginPending || isSigninPending,
    isLoggedIn: isLoggedIn.loggedIn,
  };
};
