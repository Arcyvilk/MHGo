import { useMonsterDrops } from '../../hooks/useMonsterDrops';
import { Item } from '../../containers';

import s from './FightView.module.scss';
import { useUser } from '../../hooks/useUser';

export const ModalSuccess = () => {
  const params = new URLSearchParams(location.search);
  const markerId = params.get('id');
  const level = params.get('level');
  const { userId } = useUser();
  const { drops } = useMonsterDrops(markerId, userId, level);

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
