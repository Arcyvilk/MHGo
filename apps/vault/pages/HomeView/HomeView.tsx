import { Loader, QueryBoundary } from '@mhgo/front';
import s from './HomeView.module.scss';

export const HomeView = () => (
  <QueryBoundary fallback={<Loader fullScreen />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  return <div className={s.homeView}>Dupa</div>;
};
