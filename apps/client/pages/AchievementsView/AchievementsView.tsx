import { CloseButton } from '@mhgo/front';

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

type Achievement = {
  img: string;
  name: string;
  description: string;
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

const useAchievementsApi = () => {
  const data: Achievement[] = [
    {
      img: 'https://cdn.arcyvilk.com/mhgo/misc/question.svg',
      name: 'Achievement name',
      description: 'Achievement description',
    },
    {
      img: 'https://cdn.arcyvilk.com/mhgo/misc/question.svg',
      name: 'Achievement name',
      description: 'Achievement description',
    },
    {
      img: 'https://cdn.arcyvilk.com/mhgo/misc/question.svg',
      name: 'Achievement name',
      description: 'Achievement description',
    },
  ];
  return { data };
};
