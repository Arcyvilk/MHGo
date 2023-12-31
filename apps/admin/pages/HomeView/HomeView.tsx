import { useNavigate } from 'react-router-dom';

import s from './HomeView.module.scss';

export const HomeView = () => {
  const navigate = useNavigate();

  return <div className={s.homeView}>Hehe</div>;
};
