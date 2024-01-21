import {
  useUserHealthApi,
  Flash,
  QueryBoundary,
  modifiers,
  Skeleton,
} from '@mhgo/front';
import { useUser } from '../../hooks/useUser';

import s from './HealthBar.module.scss';

type HealthBarUserProps = {
  isUserHit: boolean;
};
export const HealthBarUser = (props: HealthBarUserProps) => (
  <QueryBoundary fallback={<Skeleton width="100%" height="2rem" />}>
    <Load {...props} />
  </QueryBoundary>
);

const Load = ({ isUserHit }: HealthBarUserProps) => {
  const { userId } = useUser();
  const { data: userHealth } = useUserHealthApi(userId);

  return (
    <div className={s.wrapper} id="user_health_bar">
      <Flash type="red" isActivated={isUserHit} />
      <div className={modifiers(s, 'healthBar', { isUser: true })}>
        <div className={modifiers(s, 'healthBar__text', { isUser: true })}>
          {userHealth.roundCurrentHealth} / {userHealth.maxHealth}
        </div>
        <div
          className={modifiers(s, 'healthBar__fg', { isUser: true })}
          style={{
            width: `${
              (100 * userHealth.roundCurrentHealth) / userHealth.maxHealth
            }%`,
          }}
        />
        <div className={modifiers(s, 'healthBar__bg', { isUser: true })} />
      </div>
    </div>
  );
};
