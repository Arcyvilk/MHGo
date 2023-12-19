import { CloseButton } from '../../components/CloseButton';

import s from './NotImplementedView.module.scss';

export const NotImplementedView = () => {
  return (
    <div className={s.notImplementedView}>
      <div className={s.header}>
        <div className={s.header__title}>NOT IMPLEMENTED YET</div>
      </div>
      <CloseButton />
    </div>
  );
};
