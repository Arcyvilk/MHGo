import { useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Loader,
  QueryBoundary,
  logo,
  useAdventuresApi,
} from '@mhgo/front';

import { useAppContext } from '../../utils/context';

import s from './AuthView.module.scss';

export const AdventureSelectView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const { data: adventures } = useAdventuresApi();
  const { setAdventure, setCacheId } = useAppContext();
  const queryClient = useQueryClient();

  const onSwitchAdventure = (id: string) => {
    setAdventure({ id });
    queryClient.invalidateQueries();
    setCacheId({ id: String(Date.now()) });
    location.replace('/');
  };

  return (
    <>
      <img className={s.authView__logo} src={logo} alt="logo" />
      <div className={s.authView__title}>Select adventure</div>
      <div className={s.authView__buttons}>
        {adventures.map(adventure => (
          <Button
            label={adventure.name}
            disabled={!adventure.enabled}
            onClick={() => onSwitchAdventure(adventure.id)}
          />
        ))}
      </div>
    </>
  );
};
