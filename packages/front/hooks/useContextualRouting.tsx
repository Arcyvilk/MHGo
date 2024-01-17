import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { createSearchParams, useSearchParams } from 'react-router-dom';

type Param<T> = { key: string; value: T };

export const useContextualRouting = <T extends string>(param: Param<T>) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const route = useMemo(() => {
    return (searchParams.get(param.key) ?? param.value) as T;
  }, [searchParams]);

  const setRoute = <T extends string>(newRoute: T) => {
    // replace: false makes pages with query params annoying to navigate
    // with the browser's default back button, but makes CloseButton work
    // exactly as intended
    setSearchParams(
      { [param.key]: newRoute },
      { preventScrollReset: true, replace: true },
    );
  };

  const navigateToRoute = (params: Record<string, string>) =>
    navigate({
      pathname: '',
      search: `?${createSearchParams(params)}`,
    });

  useEffect(() => {
    if (!route) setRoute(param.key);
    else setRoute(route);
  }, [route]);

  return { route, setRoute, navigateToRoute };
};
