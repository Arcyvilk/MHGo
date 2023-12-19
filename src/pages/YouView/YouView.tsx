import { CloseButton } from '../../components/CloseButton';
import { Icon } from '../../components/Icon';
import { Size } from '../../utils/size';
import { Hunter } from './Hunter';
import s from './YouView.module.scss';

export const YouView = () => {
  return (
    <div className={s.youView}>
      <Header />
      <Hunter />
      <div className={s.youView__bottom}>
        <CloseButton />
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <div className={s.header}>
      <h1 className={s.header__title}>Hunter</h1>
      <div className={s.experience}>
        <Icon icon="Ball" size={Size.SMALL} />
        <span className={s.experience__title}>HRP</span>
        <div className={s.experience__bar}>
          <div className={s.bar__text}>0 / 100</div>
          <div className={s.bar__fg} />
          <div className={s.bar__bg} />
        </div>
      </div>
    </div>
  );
};
