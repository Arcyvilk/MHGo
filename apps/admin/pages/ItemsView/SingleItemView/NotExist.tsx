import { useNavigate } from 'react-router-dom';
import { Button } from '@mhgo/front';

import s from './SingleItemView.module.scss';

export const NotExist = () => {
  const navigate = useNavigate();
  return (
    <div className={s.singleItemView}>
      <div className={s.singleItemView__header}>
        <h1 className={s.singleItemView__title}>This item does not exist</h1>
      </div>
      <div className={s.singleItemView__footer}>
        <Button label="Back" onClick={() => navigate(-1)} />
      </div>
    </div>
  );
};
