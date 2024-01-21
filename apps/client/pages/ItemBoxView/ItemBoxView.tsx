import { useState } from 'react';

import { CloseButton, Item, QueryBoundary } from '@mhgo/front';
import { ItemContextMenuSimple } from '../../containers';
import { useUser, useUserItems, useUserMaterials } from '../../hooks/useUser';
import { TABS, Tabs } from './Tabs';

import s from './ItemBoxView.module.scss';

export const ItemBoxView = () => {
  const { userId } = useUser();
  const [activeTab, setActiveTab] = useState(TABS.MATERIALS);

  return (
    <div className={s.itemBoxView}>
      <Header />
      <div className={s.itemBoxView__wrapper}>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === TABS.ITEMS && (
          <QueryBoundary fallback={<SkeletonItemBox />}>
            <UserItems userId={userId} />
          </QueryBoundary>
        )}
        {activeTab === TABS.MATERIALS && (
          <QueryBoundary fallback={<SkeletonItemBox />}>
            <UserMaterials userId={userId} />
          </QueryBoundary>
        )}
      </div>
      <CloseButton />
    </div>
  );
};

const SkeletonItemBox = () => (
  <div className={s.itemBoxView__container}>
    {new Array(12).fill(<Item.Skeleton />)}
  </div>
);

type UserItemBoxProps = { userId: string };
const UserItems = ({ userId }: UserItemBoxProps) => {
  const userItems = useUserItems(userId);

  return (
    <div className={s.itemBoxView__container}>
      {userItems
        .filter(userItem => userItem.amount)
        .map(userItem => {
          const data = { ...userItem, purchasable: false };
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
          const data = { ...userMaterial, purchasable: false };
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
