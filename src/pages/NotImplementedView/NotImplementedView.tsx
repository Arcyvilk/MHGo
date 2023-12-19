import { CloseButton } from '../../components/CloseButton';

import s from './NotImplementedView.module.scss';

export const NotImplementedView = () => {
  return (
    <div className={s.notImplementedView}>
      <h1>NOT IMPLEMENTED YET</h1>
      <CloseButton />
    </div>
  );
};
