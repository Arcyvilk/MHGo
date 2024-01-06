import { useEffect, useState, useCallback } from 'react';

import { CurrencyType } from '@mhgo/types';
import {
  Item,
  Button,
  Loader,
  Modal,
  QueryBoundary,
  addCdnUrl,
  useMonsterMarkerDropsApi,
  useUpdateUserWealthApi,
} from '@mhgo/front';

import { ModalLevelUp } from './ModalLevelUp';
import { useUser } from '../../hooks/useUser';
import { useUserLevelUp } from '../../hooks/useUserLevelUp';
import { useMonsterMarker } from '../../hooks/useMonsterMarker';

import s from './ModalResult.module.scss';

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

  const [isModalLevelUpOpen, setIsModalLevelUpOpen] = useState(false);
  const [isLootRedeemed, setIsLootRedeemed] = useState(false);
  const { userId } = useUser();
  const { monster } = useMonsterMarker();
  const {
    data: drops,
    mutate: mutateUserDrops,
    isSuccess,
  } = useMonsterMarkerDropsApi(userId);
  const { mutate: mutateUserExp, didLevelUp, levels } = useUserLevelUp(userId);
  const { mutate: mutateUserWealth } = useUpdateUserWealthApi(userId);

  const expChange = Number(level) * monster.baseExp;
  const wealthChange: { [key in CurrencyType]?: number } = {};
  monster.baseWealth.forEach(currency => {
    wealthChange[currency.type] = currency.amount;
  });

  const redeemLoot = useCallback(() => {
    if (isLootRedeemed) return;
    setIsLootRedeemed(true);
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

  useEffect(() => {
    if (didLevelUp) setIsModalLevelUpOpen(true);
  }, [didLevelUp]);

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
      {didLevelUp && (
        <ModalLevelUp
          levels={levels}
          isOpen={isModalLevelUpOpen}
          setIsOpen={setIsModalLevelUpOpen}
        />
      )}
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
