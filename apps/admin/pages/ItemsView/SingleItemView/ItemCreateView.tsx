import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CraftList, ItemAction, Item as TItem, UserAmount } from '@mhgo/types';
import { CDN_URL } from '@mhgo/front/env';
import {
  Button,
  Loader,
  QueryBoundary,
  useAdminCreateItemApi,
} from '@mhgo/front';
import { ActionBar, HeaderEdit } from '../../../containers';
import { DEFAULT_ITEM, DEFAULT_STATS } from '../../../utils/defaults';
import { Status } from '../../../utils/types';
import { SectionBasic } from './SectionBasic';
import { SectionCraftable } from './SectionCraftable';
import { SectionEquippable } from './SectionEquippable';
import { SectionPurchasable } from './SectionPurchasable';
import { SectionUsable } from './SectionUsable';
import { NotExist } from './NotExist';

import s from './SingleItemView.module.scss';
import { toast } from 'react-toastify';

export const ItemCreateView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState({
    isSuccess: false,
    isError: false,
    isPending: false,
  });
  const {
    item,
    itemAction,
    itemCraft,
    itemPrice,
    itemStats,
    itemImg,
    setItem,
    setItemAction,
    setItemCraft,
    setItemPrice,
    setItemStats,
    onSave,
  } = useUpdateItem(setStatus);

  if (!item) return <NotExist />;

  return (
    <div className={s.singleItemView}>
      <HeaderEdit status={status} title="Create item" />
      <ActionBar
        title={`Item ID: ${item?.id}`}
        buttons={
          <>
            <Button
              label="Cancel"
              inverted
              simple
              onClick={() => navigate(-1)}
              variant={Button.Variant.GHOST}
            />
            <Button
              label="Save"
              onClick={onSave}
              variant={Button.Variant.ACTION}
            />
          </>
        }
      />
      <div className={s.singleItemView__content}>
        <SectionBasic item={item} setItem={setItem} itemImg={itemImg} />
        <div className={s.singleItemView__content}>
          <SectionEquippable
            item={item}
            setItem={setItem}
            itemStats={itemStats}
            setItemStats={setItemStats}
          />
          <SectionCraftable
            item={item}
            setItem={setItem}
            itemCraft={itemCraft}
            setItemCraft={setItemCraft}
          />
          <SectionUsable
            item={item}
            setItem={setItem}
            itemAction={itemAction}
            setItemAction={setItemAction}
          />
          <SectionPurchasable
            item={item}
            setItem={setItem}
            itemPrice={itemPrice}
            setItemPrice={setItemPrice}
          />
        </div>
      </div>
    </div>
  );
};

const useUpdateItem = (setStatus: (status: Status) => void) => {
  const [item, setItem] = useState<TItem>(DEFAULT_ITEM);
  const [itemAction, setItemAction] = useState<ItemAction>({});
  const [itemCraft, setItemCraft] = useState<CraftList[]>([]);
  const [itemStats, setItemStats] = useState(DEFAULT_STATS);
  const [itemPrice, setItemPrice] = useState<UserAmount[]>([]);

  const itemImg = useMemo(() => item?.img.replace(CDN_URL, '') ?? '', [item]);

  const { mutateItem } = useStatus(setStatus);

  const onSave = () => {
    if (item) {
      mutateItem({ item, itemAction, itemCraft, itemPrice, itemStats });
    }
  };

  return {
    item,
    itemImg,
    itemAction,
    itemCraft,
    itemPrice,
    itemStats,
    setItem,
    setItemAction,
    setItemCraft,
    setItemPrice,
    setItemStats,
    onSave,
  };
};

const useStatus = (setStatus: (status: Status) => void) => {
  // STATUS: ITEM
  const {
    mutate: mutateItem,
    error,
    isSuccess,
    isError,
    isPending,
  } = useAdminCreateItemApi();

  if (isError) toast.error(error?.message);

  useEffect(() => {
    setStatus({
      isSuccess,
      isError,
      isPending,
    });
  }, [isSuccess, isError, isPending]);

  return { mutateItem };
};
