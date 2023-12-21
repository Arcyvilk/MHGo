import { useMonsterDrops } from '../../hooks/useMonsterDrops';
import { Item } from '../ItemBoxView/Item';

import s from './FightView.module.scss';

export const ModalSuccess = () => {
  const params = new URLSearchParams(location.search);
  const markerId = params.get('id');
  const { drops } = useMonsterDrops(markerId);

  return (
    <div className={s.result}>
      <h1 className={s.result__title}>Success!</h1>
      <p className={s.result__desc}>Monster dropped the following items:</p>
      <div className={s.result__drops}>
        {(drops ?? []).map(drop => (
          <Item {...drop} purchasable={false} />
        ))}
      </div>
    </div>
  );
};
