import { useNavigate } from 'react-router-dom';

import {
  Button,
  CloseButton,
  Icon,
  InfoBar,
  Loader,
  QueryBoundary,
  Size,
  modifiers,
  useUserHealthApi,
} from '@mhgo/front';
import { HealthBarSimple, Tutorial } from '../../containers';
import { useUser, useUserTutorial } from '../../hooks/useUser';
import { useMonsterMarker } from '../../hooks/useMonsterMarker';

import s from './FightView.module.scss';

export const PrepareView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const { userId } = useUser();
  const { isFinishedTutorial } = useUserTutorial(userId);
  const { markerId, monster, isFetched, inRange } = useMonsterMarker();
  const { habitat, level, name, img } = monster;

  if (!isFetched) return <Loader />;

  return (
    <div className={modifiers(s, 'fightView', habitat)}>
      {!isFinishedTutorial && (
        <Tutorial stepFrom="part2_start" stepTo="part2_end" />
      )}
      <Header name={name} level={level} />
      {inRange ? (
        <div className={s.fightView__wrapper}>
          <img className={s.fightView__monster} src={img} draggable={false} />
          <Actions markerId={markerId} level={level} />
        </div>
      ) : (
        <>
          <img className={s.fightView__monster} src={img} draggable={false} />
          <InfoBar text="You are not in range!" />
          <CloseButton />
        </>
      )}
    </div>
  );
};

type HeaderProps = { name?: string; level?: number };
const Header = ({ name = '?', level = 0 }: HeaderProps) => {
  return (
    <div className={s.header}>
      <div className={s.header__difficulty}>
        {new Array(level).fill(null).map(_ => (
          <Icon icon="Star" size={Size.SMALL} />
        ))}
      </div>
      <h1 className={s.header__title}>{name}</h1>
    </div>
  );
};

type ActionsProps = { markerId: string | null; level?: number };
const Actions = ({ markerId, level = 0 }: ActionsProps) => {
  const navigate = useNavigate();
  const { userId } = useUser();
  const { data: userHealth } = useUserHealthApi(userId);
  const isUserAlive = userHealth.currentHealth > 0;

  const onFight = () => {
    navigate(`/fight?id=${markerId}&level=${level}`);
  };
  const onFlee = () => {
    navigate('/');
  };

  return (
    <div className={s.fightView__buttons}>
      <HealthBarSimple
        maxHP={userHealth.maxHealth}
        currentHP={userHealth.currentHealth}
      />
      <Button
        label="Fight!"
        onClick={onFight}
        disabled={!isUserAlive}
        variant={Button.Variant.ACTION}
        title={isUserAlive ? null : 'You cannot initiate a fight when dead!'}
        simple
      />
      <Button label="Flee!" onClick={onFlee} simple />
    </div>
  );
};
