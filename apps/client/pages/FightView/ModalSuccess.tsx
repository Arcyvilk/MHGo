import { useEffect, useState } from 'react';
import { ItemClass } from '@mhgo/types';

import { useMarkerMonsterDrops } from '../../hooks/useMarkerMonsterDrops';
import { Item } from '../../containers';
import { useUserPutMaterialsApi } from '../../api';
import { useUser } from '../../hooks/useUser';

import s from './FightView.module.scss';

export const ModalSuccess = () => {
  const params = new URLSearchParams(location.search);
  const markerId = params.get('id');
  const level = params.get('level');

  const [isLootRedeemed, setIsLootRedeemed] = useState(false);
  const { userId } = useUser();

  const { drops } = useMarkerMonsterDrops(markerId, level);
  const { mutate: materialsMutate } = useUserPutMaterialsApi(userId);

  // TODO this triggers too often!
  useEffect(() => {
    if (isLootRedeemed) return;
    const materialDrops = (
      drops?.filter(drop => drop.dropClass === ItemClass.MATERIAL) ?? []
    ).map(drop => ({ id: drop.id, amount: drop.amount }));
    // const itemDrops = drops?.filter(
    //   drop => drop.dropClass === ItemClass.ITEM,
    // );
    materialsMutate(materialDrops);
    // itemsMutate(itemDrops);
    setIsLootRedeemed(true);
  }, [isLootRedeemed]);

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
