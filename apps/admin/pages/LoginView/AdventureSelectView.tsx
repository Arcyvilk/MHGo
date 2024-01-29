import { useQueryClient } from '@tanstack/react-query';
import { Button, logo } from '@mhgo/front';
import { Adventure } from '@mhgo/types';

import { useAppContext } from '../../utils/context';

import s from './LoginView.module.scss';

type AdventureSelectViewProps = {
  adventures: Adventure[];
};
export const AdventureSelectView = ({
  adventures,
}: AdventureSelectViewProps) => {
  const { setAdventure } = useAppContext();
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
