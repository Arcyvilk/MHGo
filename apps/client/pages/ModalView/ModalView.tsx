import { Icon, Loader, QueryBoundary } from '@mhgo/front';
import { useNewsApi } from '@mhgo/front';
import { useUser } from '../../hooks/useUser';
import s from './ModalView.module.scss';

export const NewsModal = () => (
  <QueryBoundary fallback={<Loader />}>
    <LoadNewsModal />
  </QueryBoundary>
);

const LoadNewsModal = () => {
  const { userName } = useUser();
  const { data: news } = useNewsApi();

  return (
    <div className={s.modalView__news}>
      {news.map(post => (
        <div className={s.post} key={String(post.date)}>
          <h2 className={s.post__title}>{post.title}</h2>
          <div className={s.post__details}>
            <span>{post.author}</span>
            <span>{String(post.date)}</span>
          </div>
          <img className={s.post__img} src={post.img} />
          <div className={s.post__content}>
            {post.content.replace('%', userName)}
          </div>
        </div>
      ))}
    </div>
  );
};

export const AppearanceModal = () => {
  return (
    <div className={s.modalView__appearance}>
      You're already beautiful &lt;3
    </div>
  );
};

export const PartyModal = () => {
  return (
    <div className={s.modalView__party}>
      <Icon icon="Spin" spin />
    </div>
  );
};
