import { CloseButton, useAchievementsApi } from '@mhgo/front';
import { Achievement } from '@mhgo/types';

import s from './AchievementsView.module.scss';

export const AchievementsView = () => {
  const { data: achievements } = useAchievementsApi();

  return (
    <div className={s.achievementsView}>
      <div className={s.header}>
        <div className={s.header__title}>Achievements</div>
      </div>
      <div className={s.achievementsView__wrapper}>
        {achievements.map(achievement => (
          <AchievementTile achievement={achievement} />
        ))}
      </div>
      <CloseButton />
    </div>
  );
};

type AchievementTileProps = { achievement: Achievement };
const AchievementTile = ({ achievement }: AchievementTileProps) => {
  return (
    <div className={s.achievement}>
      <img className={s.achievement__img} src={achievement.img} />
      <div className={s.achievement__details}>
        <h2 className={s.achievement__name}>{achievement.name}</h2>
        <div className={s.achievement__description}>
          {achievement.description}
        </div>
        <progress />
      </div>
    </div>
  );
};
