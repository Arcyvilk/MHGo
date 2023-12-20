import { useState } from 'react';
import { TABS, Tabs } from './Tabs';
import { Item } from './Item';
import { CloseButton } from '../../components/CloseButton';

import s from './ItemBoxView.module.scss';

import { MOCK_USER_ID, userMaterials } from '../../_mock/save';
import { userItems } from '../../_mock/save';
import { items } from '../../_mock/items';
import { materials } from '../../_mock/materials';

export const ItemBoxView = () => {
  const [activeTab, setActiveTab] = useState(TABS.MATERIALS);

  return (
    <div className={s.itemBoxView}>
      <Header />
      <div className={s.itemBoxView__wrapper}>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === TABS.ITEMS && <UserItems userId={MOCK_USER_ID} />}
        {activeTab === TABS.MATERIALS && (
          <UserMaterials userId={MOCK_USER_ID} />
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
      {userItems.map(userItem => (
        <Item {...userItem} />
      ))}
    </div>
  );
};

const UserMaterials = ({ userId }: UserItemBoxProps) => {
  const userItems = useUserMaterials(userId);

  return (
    <div className={s.itemBoxView__container}>
      {userItems.map(userItem => (
        <Item {...userItem} />
      ))}
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

const useUserItems = (userId: string) => {
  const userData = userItems.find(user => user.userId === userId);
  const userItemData = items
    .filter(item => userData?.items.find(userItem => userItem.id === item.id))
    .map(item => ({
      ...item,
      amount:
        userData?.items.find(userItem => userItem.id === item.id)?.amount ?? 0,
    }));
  return userItemData;
};

const useUserMaterials = (userId: string) => {
  const userData = userMaterials.find(user => user.userId === userId);
  const userMaterialData = materials
    .filter(
      material =>
        userData?.materials.find(
          userMaterial => userMaterial.id === material.id,
        ),
    )
    .map(material => ({
      ...material,
      amount:
        userData?.materials.find(
          userMaterial => userMaterial.id === material.id,
        )?.amount ?? 0,
    }));
  return userMaterialData;
};
