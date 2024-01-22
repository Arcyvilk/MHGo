import {
  Button,
  CloseButton,
  Icon,
  InfoBar,
  Loader,
  QueryBoundary,
  Size,
  modifiers,
  useNavigateWithScroll,
  useUserHealthApi,
} from '@mhgo/front';
import { HealthBarSimple, Tutorial } from '../../containers';
import { useUser } from '../../hooks/useUser';
import { useTutorialProgress } from '../../hooks/useTutorial';
import { useMonsterMarker } from '../../hooks/useMonsterMarker';

import s from './FightView.module.scss';
import { useMonsterHealthChange } from './utils';

export const PrepareView = () => (
  <QueryBoundary fallback={<Loader fullScreen />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  // Prefetch before fight
  useMonsterHealthChange();
  const { isFinishedTutorialPartOne } = useTutorialProgress();
  const { markerId, monster, inRange } = useMonsterMarker();
  const { habitat, level, name, img } = monster;

  return (
    <div className={modifiers(s, 'fightView', habitat)}>
      <Tutorial
        stepFrom="part2_start"
        stepTo="part2_end"
        requirement={!isFinishedTutorialPartOne}
      />
      <Header name={name} level={level} />
      {inRange ? (
        <div className={s.fightView__wrapper}>
          <img className={s.fightView__monster} src={img} draggable={false} />
          <Actions markerId={markerId} level={level} />
        </div>
      ) : (
        <div className={s.fightView__wrapper}>
          <img className={s.fightView__monster} src={img} draggable={false} />
          <InfoBar text="You are not in range!" />
          <CloseButton />
        </div>
      )}
    </div>
  );
};

type HeaderProps = { name?: string; level?: number };
const Header = ({ name = '?', level = 0 }: HeaderProps) => {
  return (
    <div className={s.header}>
      <div className={s.header__difficulty}>
        {new Array(level).fill(null).map((_, i) => (
          <Icon key={`star-${i}`} icon="Star" size={Size.SMALL} />
        ))}
      </div>
      <h1 className={s.header__title}>{name}</h1>
    </div>
  );
};

type ActionsProps = { markerId: string | null; level?: number };
const Actions = ({ markerId, level = 0 }: ActionsProps) => {
  const { navigateWithoutScroll } = useNavigateWithScroll();
  const { userId } = useUser();
  const { data: userHealth } = useUserHealthApi(userId);
  const isUserAlive = userHealth.currentHealth > 0;

  const onFight = () => {
    navigateWithoutScroll(`/fight?id=${markerId}&level=${level}`);
  };
  const onFlee = () => {
    navigateWithoutScroll('/');
  };

  return (
    <div className={s.fightView__buttons}>
      <HealthBarSimple
        maxHP={userHealth.maxHealth}
        currentHP={userHealth.roundCurrentHealth}
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
