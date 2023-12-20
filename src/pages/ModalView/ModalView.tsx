import { Icon } from '../../components';

import s from './ModalView.module.scss';

import { news } from '../../_mock/news';
import { USER_NAME } from '../../_mock/settings';

export const PartyModal = () => {
  return (
    <div className={s.modalView__party}>
      <Icon icon="Spin" spin />
    </div>
  );
};

export const NewsModal = () => {
  return (
    <div className={s.modalView__news}>
      {news.map(post => (
        <div className={s.post}>
          <h2 className={s.post__title}>{post.title}</h2>
          <div className={s.post__details}>
            <span>{post.author}</span>
            <span>{post.date.toLocaleDateString()}</span>
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
