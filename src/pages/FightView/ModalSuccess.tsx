import { useMonsterDrops } from '../../hooks/useMonsterDrops';
import { Item } from '../../containers';

import s from './FightView.module.scss';

export const ModalSuccess = () => {
  const params = new URLSearchParams(location.search);
  const markerId = params.get('id');
  const { drops } = useMonsterDrops(markerId);

  const listOfDrops = (drops ?? []).map(drop => (
    <Item {...drop} purchasable={false} />
  ));

  return (
    <div className={s.result}>
      <h1 className={s.result__title}>Success!</h1>
      <p className={s.result__desc}>Monster dropped the following items:</p>
      <div className={s.result__drops}>
        {listOfDrops.length
          ? listOfDrops
          : "NOTHING! God damn it you're so unlucky ;-;"}
      </div>
    </div>
  );
};
