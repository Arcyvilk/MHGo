import { useQueryClient } from '@tanstack/react-query';
import { Button, logo } from '@mhgo/front';
import { Adventure } from '@mhgo/types';

import { useAppContext } from '../../utils/context';

import s from './AuthView.module.scss';

type AdventureSelectViewProps = {
  adventures: Adventure[];
};
export const AdventureSelectView = ({
  adventures,
}: AdventureSelectViewProps) => {
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
      {adventures.map(adventure => (
        <Button
          label={adventure.name}
          disabled={!adventure.enabled}
          onClick={() => onSwitchAdventure(adventure.id)}
        />
      ))}
    </>
  );
};
