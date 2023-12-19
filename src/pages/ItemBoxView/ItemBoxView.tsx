import { useState } from 'react';
import { TABS, Tabs } from './Tabs';
import { Item } from './Item';
import { CloseButton } from '../../components/CloseButton';

import s from './ItemBoxView.module.scss';

import { MOCK_USER_ID } from '../../_mock/save';
import { userItems } from '../../_mock/save';
import { items } from '../../_mock/items';

export const ItemBoxView = () => {
  const [activeTab, setActiveTab] = useState(TABS.MATERIALS);
  const userItems = useUserItems(MOCK_USER_ID);

  return (
    <div className={s.itemBoxView}>
      <Header />
      <div className={s.itemBoxView__wrapper}>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className={s.itemBoxView__container}>
          {userItems.map(userItem => (
            <Item {...userItem} />
          ))}
        </div>
      </div>
      <CloseButton />
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
