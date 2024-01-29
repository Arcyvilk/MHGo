import { useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Loader,
  QueryBoundary,
  logo,
  useAdventuresApi,
} from '@mhgo/front';

import { useAppContext } from '../../utils/context';

import s from './LoginView.module.scss';

export const AdventureSelectView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const { setAdventure } = useAppContext();
  const { data: adventures } = useAdventuresApi();
  const queryClient = useQueryClient();

  const onSwitchAdventure = (id: string) => {
    setAdventure({ id });
    queryClient.invalidateQueries();
    location.replace('/');
  };

  return (
    <div className={s.loginView__wrapper}>
      <img className={s.loginView__logo} src={logo} alt="logo" />
      <div className={s.loginView__title}>Select adventure</div>
      <div className={s.loginView__buttons}>
        {adventures.map(adventure => (
          <Button
            label={adventure.name}
            disabled={!adventure.enabled}
            onClick={() => onSwitchAdventure(adventure.id)}
          />
        ))}
      </div>
    </div>
  );
};
