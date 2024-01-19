import { useLoginApi, useLogoutApi, useMeApi, useSignInApi } from '@mhgo/front';
import { useAppContext } from '../utils/context';
import { useEffect } from 'react';

export const useMe = () => {
  const { isLoggedIn, bearerToken, setBearerToken } = useAppContext();
  const {
    mutate: mutateLogin,
    isPending: isLoginPending,
    isError: isLoginError,
    error: loginError,
  } = useLoginApi(setBearerToken);
  const { mutate: mutateLogout } = useLogoutApi(setBearerToken);
  const {
    mutate: mutateSignIn,
    isPending: isSigninPending,
    isError: isSigninError,
    error: singinError,
  } = useSignInApi(setBearerToken);

  const {
    data: userAuthData,
    isError,
    isFetched,
  } = useMeApi(Boolean(bearerToken.bearer));

  const loginUser = (userName: string, pwd: string) => {
    mutateLogin({ userName, pwd });
  };

  const logoutUser = () => {
    mutateLogout();
  };

  useEffect(() => {
    if (isFetched && isError) {
      logoutUser();
    }
  }, [isError, isFetched]);

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
    isLoginError,
    isSigninError,
    loginError,
    singinError,
    isLoggedIn,
  };
};
