import { useState } from 'react';

import { TABS, Tabs } from './Tabs';
import { Item } from '@mhgo/front';
import { CloseButton, Loader, QueryBoundary } from '@mhgo/front';
import { useUserItems, useUserMaterials } from '../../hooks/useUser';

import s from './ItemBoxView.module.scss';

import { USER_ID } from '../../_mock/settings';
import { ItemContextMenu, ItemContextMenuSimple } from '../../containers';

export const ItemBoxView = () => {
  const [activeTab, setActiveTab] = useState(TABS.MATERIALS);

  return (
    <div className={s.itemBoxView}>
      <Header />
      <div className={s.itemBoxView__wrapper}>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === TABS.ITEMS && (
          <QueryBoundary fallback={<Loader />}>
            <UserItems userId={USER_ID} />
          </QueryBoundary>
        )}
        {activeTab === TABS.MATERIALS && (
          <QueryBoundary fallback={<Loader />}>
            <UserMaterials userId={USER_ID} />
          </QueryBoundary>
        )}
      </div>
      <CloseButton />
    </div>
  );
};

type UserItemBoxProps = { userId: string };
const UserItems = ({ userId }: UserItemBoxProps) => {
  const userItems = useUserItems(userId);

  return (
    <div className={s.itemBoxView__container}>
      {userItems
        .filter(userItem => userItem.amount)
        .map(userItem => {
          const data = { ...userItem, purchasable: false, price: 0 };
          return (
            <div className={s.itemBoxView__containerWrapper} key={userItem.id}>
              <ItemContextMenuSimple item={data} />
            </div>
          );
        })}
    </div>
  );
};

const UserMaterials = ({ userId }: UserItemBoxProps) => {
  const userMaterials = useUserMaterials(userId);

  return (
    <div className={s.itemBoxView__container}>
      {userMaterials
        .filter(userMaterial => userMaterial.amount)
        .map(userMaterial => {
          const data = { ...userMaterial, purchasable: false, price: 0 };
          return (
            <div
              className={s.itemBoxView__containerWrapper}
              key={userMaterial.id}>
              <ItemContextMenuSimple material={data} />
            </div>
          );
        })}
    </div>
  );
};

const Header = () => {
  return (
    <div className={s.header}>
      <h1 className={s.header__title}>Items</h1>
    </div>
  );
};
