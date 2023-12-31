import { Icon } from '@mhgo/front';
import { useNewsApi } from '@mhgo/front';

import s from './ModalView.module.scss';

import { USER_NAME } from '../../_mock/settings';

export const PartyModal = () => {
  return (
    <div className={s.modalView__party}>
      <Icon icon="Spin" spin />
    </div>
  );
};

export const NewsModal = () => {
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
            {post.content.replace('%', USER_NAME)}
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
