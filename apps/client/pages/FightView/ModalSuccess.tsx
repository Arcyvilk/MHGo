import { useEffect, useState, useCallback } from 'react';

import { Item } from '../../containers';
import { useMonsterMarkerDropsApi } from '../../api';
import { useUser } from '../../hooks/useUser';
import { addCdnUrl } from '../../utils/addCdnUrl';

import s from './FightView.module.scss';
import { Modal } from '../../components';

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose: () => void;
};
export const ModalSuccess = ({ isOpen, setIsOpen, onClose }: ModalProps) => {
  const params = new URLSearchParams(location.search);
  const markerId = params.get('id') ?? '';
  const level = params.get('level') ?? '0';

  const [isLootRedeemed, setIsLootRedeemed] = useState(false);
  const { userId } = useUser();

  const { data: drops, mutate: mutateUserDrops } =
    useMonsterMarkerDropsApi(userId);

  const redeemLoot = useCallback(() => {
    if (!isLootRedeemed) setIsLootRedeemed(true);
    mutateUserDrops({
      markerId,
      monsterLevel: Number(level),
    });
  }, [isLootRedeemed]);

  useEffect(() => {
    redeemLoot();
  }, []);

  const listOfDrops = (drops ?? []).map(drop => {
    const data = {
      ...drop,
      img: addCdnUrl(drop.img),
      purchasable: false,
      price: 0,
    };
    return <Item data={data} key={drop.id} />;
  });

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} onClose={onClose}>
      <div className={s.result}>
        <h1 className={s.result__title}>Success!</h1>
        <p className={s.result__desc}>Monster dropped the following items:</p>
        <div className={s.result__drops}>
          {listOfDrops.length
            ? listOfDrops
            : "NOTHING! God damn it you're so unlucky ;-;"}
        </div>
      </div>
    </Modal>
  );
};
