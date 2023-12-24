import { useMarkerMonsterDrops } from '../../hooks/useMarkerMonsterDrops';
import { Item } from '../../containers';

import s from './FightView.module.scss';

export const ModalSuccess = () => {
  const params = new URLSearchParams(location.search);
  const markerId = params.get('id');
  const level = params.get('level');

  const { drops } = useMarkerMonsterDrops(markerId, level);

  const listOfDrops = (drops ?? []).map(drop => {
    const data = {
      ...drop,
      purchasable: false,
      price: 0,
    };
    return <Item data={data} key={drop.id} />;
  });

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
