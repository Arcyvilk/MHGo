import React, { PropsWithChildren, useContext, useMemo, useState } from 'react';
import { LSKeys, useLocalStorage } from '@mhgo/front';
import {
  Material,
  Monster,
  Order,
  Item as TItem,
  Resource,
  AdminUser,
} from '@mhgo/types';

type ContextType = {
  isLoggedIn: boolean;
  bearerToken: { bearer: string | null };
  setBearerToken: (bearerToken: { bearer: string | null }) => void;
  adventure: { id: string };
  setAdventure: (adventure: { id: string }) => void;
  // ORDERING

  orderItem: Order;
  orderMaterial: Order;
  orderMonster: Order;
  orderResource: Order;
  orderUser: Order;

  setOrderItem: (order: Order) => void;
  setOrderMaterial: (order: Order) => void;
  setOrderMonster: (order: Order) => void;
  setOrderResource: (order: Order) => void;
  setOrderUser: (order: Order) => void;

  orderByItem: keyof TItem;
  orderByMaterial: keyof Material;
  orderByMonster: keyof Monster | 'baseDPS';
  orderByResource: keyof Resource;
  orderByUser: keyof AdminUser;

  setOrderByItem: (orderBy: keyof TItem) => void;
  setOrderByMaterial: (orderBy: keyof Material) => void;
  setOrderByMonster: (orderBy: keyof Monster | 'baseDPS') => void;
  setOrderByResource: (orderBy: keyof Resource) => void;
  setOrderByUser: (orderBy: keyof AdminUser) => void;
};

export const AppContextProvider = ({
  children,
}: PropsWithChildren): JSX.Element => {
  const [bearerToken, setBearerToken] = useLocalStorage<{
    bearer: string | null;
  }>(LSKeys.MHGO_AUTH, {
    bearer: null,
  });
  const [adventure, setAdventure] = useLocalStorage<{
    id: string;
  }>(LSKeys.MHGO_ADVENTURE, {
    id: 'mhgo',
  });

  const isLoggedIn = useMemo<boolean>(
    () => Boolean(bearerToken.bearer),
    [bearerToken?.bearer],
  );

  // ORDERING

  const [orderItem, setOrderItem] = useState<Order>('asc');
  const [orderByItem, setOrderByItem] = useState<keyof TItem>('rarity');
  const [orderMaterial, setOrderMaterial] = useState<Order>('asc');
  const [orderByMaterial, setOrderByMaterial] =
    useState<keyof Material>('rarity');
  const [orderResource, setOrderResource] = useState<Order>('asc');
  const [orderByResource, setOrderByResource] =
    useState<keyof Resource>('levelRequirements');
  const [orderMonster, setOrderMonster] = useState<Order>('asc');
  const [orderByMonster, setOrderByMonster] = useState<
    keyof Monster | 'baseDPS'
  >('levelRequirements');
  const [orderUser, setOrderUser] = useState<Order>('asc');
  const [orderByUser, setOrderByUser] = useState<keyof AdminUser>('name');

  const value = {
    isLoggedIn,
    bearerToken,
    setBearerToken,
    adventure,
    setAdventure,

    // ORDERING
    orderItem,
    orderMaterial,
    orderMonster,
    orderResource,
    orderUser,

    setOrderItem,
    setOrderMaterial,
    setOrderMonster,
    setOrderResource,
    setOrderUser,

    orderByItem,
    orderByMaterial,
    orderByMonster,
    orderByResource,
    orderByUser,

    setOrderByItem,
    setOrderByMaterial,
    setOrderByMonster,
    setOrderByResource,
    setOrderByUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const AppContext = React.createContext({} as ContextType);
export const useAppContext = (): ContextType => useContext(AppContext);
