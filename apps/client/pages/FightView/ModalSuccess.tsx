import { useEffect, useState, useCallback } from 'react';

import { Item } from '../../containers';
import {
  useMonsterMarkerDropsApi,
  useUpdateUserExp,
  useUpdateUserWealth,
} from '../../api';
import { useUser } from '../../hooks/useUser';
import { addCdnUrl } from '../../utils/addCdnUrl';
import { Button, Loader, Modal, QueryBoundary } from '@mhgo/front';

import s from './ModalResult.module.scss';
import { useMonster } from '../../hooks/useMonster';
import { CurrencyType } from '@mhgo/types';

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose: () => void;
};
export const ModalSuccess = ({ isOpen, setIsOpen, onClose }: ModalProps) => (
  <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
    <div className={s.result}>
      <h1 className={s.result__title}>Success!</h1>
      <QueryBoundary fallback={<Loader />}>
        <Load onClose={onClose} />
      </QueryBoundary>
    </div>
  </Modal>
);

const Load = ({ onClose }: { onClose: () => void }) => {
  const params = new URLSearchParams(location.search);
  const markerId = params.get('id') ?? '';
  const level = params.get('level') ?? '0';

  const [isLootRedeemed, setIsLootRedeemed] = useState(false);
  const { userId } = useUser();
  const { monster } = useMonster();
  const {
    data: drops,
    mutate: mutateUserDrops,
    isSuccess,
  } = useMonsterMarkerDropsApi(userId);
  const { mutate: mutateUserExp } = useUpdateUserExp(userId);
  const { mutate: mutateUserWealth } = useUpdateUserWealth(userId);

  const expChange = Number(level) * monster.baseExp;
  const wealthChange: { [key in CurrencyType]?: number } = {};
  monster.baseWealth.forEach(currency => {
    wealthChange[currency.type] = currency.amount;
  });

  const redeemLoot = useCallback(() => {
    if (!isLootRedeemed) setIsLootRedeemed(true);
    mutateUserWealth(wealthChange);
    mutateUserExp({ expChange });
    mutateUserDrops({
      markerId,
      monsterLevel: Number(level),
    });
  }, [isLootRedeemed]);

  useEffect(() => {
    redeemLoot();
  }, []);

  const listOfDrops = drops.map(drop => {
    const data = {
      ...drop,
      img: addCdnUrl(drop.img),
      purchasable: false,
      price: 0,
    };
    return <Item data={data} key={drop.id} />;
  });

  return (
    <div className={s.modalSuccess}>
      <div className={s.result__misc}>
        <div>
          <span style={{ fontWeight: 900 }}>EXP:</span> +{expChange}
        </div>
        {/* TODO display money properly */}
        <div>
          <span style={{ fontWeight: 900 }}>Money:</span>
          {JSON.stringify(wealthChange)}
        </div>
      </div>
      <p className={s.result__desc}>Monster dropped the following items:</p>
      <div className={s.result__drops}>
        {isSuccess ? (
          listOfDrops?.length ? (
            listOfDrops
          ) : (
            "NOTHING! God damn it you're so unlucky ;-;"
          )
        ) : (
          <Loader />
        )}
      </div>
      <Button label="Claim" onClick={onClose} simple />
    </div>
  );
};
