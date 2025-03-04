import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Loader,
  QueryBoundary,
  removeCdnUrl,
  useAdminUpdateItemActionApi,
  useAdminUpdateItemApi,
  useAdminUpdateItemCraftlistApi,
  useAdminUpdateItemPriceApi,
  useAdminUpdateItemStatsApi,
  useItemActionsApi,
  useItemCraftsApi,
  useItemPriceApi,
  useItemStatsApi,
  useItemsApi,
  useMonsterDropsApi,
} from '@mhgo/front';
import { ActionBar, HeaderEdit } from '../../../containers';
import { DEFAULT_STATS } from '../../../utils/defaults';
import { Status } from '../../../utils/types';
import { SectionBasic } from './SectionBasic';
import { SectionCraftable } from './SectionCraftable';
import { SectionEquippable } from './SectionEquippable';
import { SectionPurchasable } from './SectionPurchasable';
import { SectionUsable } from './SectionUsable';
import { NotExist } from './NotExist';

import s from './SingleItemView.module.scss';

export const ItemEditView = () => (
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
    updatedItem,
    updatedItemAction,
    updatedItemCraft,
    updatedItemPrice,
    updatedItemStats,
    itemImg,
    itemDrops,
    setUpdatedItem,
    setUpdatedItemAction,
    setUpdatedItemCraft,
    setUpdatedItemPrice,
    setUpdatedItemStats,
    onSave,
  } = useUpdateItem(setStatus);

  if (!item) return <NotExist />;

  return (
    <div className={s.singleItemView}>
      <HeaderEdit status={status} title="Edit item" hasBackButton={true} />
      <ActionBar
        title={`Item ID: ${updatedItem?.id}`}
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
        <SectionBasic
          item={updatedItem!}
          setItem={setUpdatedItem}
          itemImg={itemImg}
          itemDrops={itemDrops}
        />
        <div className={s.singleItemView__content}>
          <SectionEquippable
            item={updatedItem!}
            setItem={setUpdatedItem}
            itemStats={updatedItemStats}
            setItemStats={setUpdatedItemStats}
          />
          <SectionCraftable
            item={updatedItem}
            setItem={setUpdatedItem}
            itemCraft={updatedItemCraft}
            setItemCraft={setUpdatedItemCraft}
            itemId={item?.id}
          />
          <SectionUsable
            item={updatedItem}
            setItem={setUpdatedItem}
            itemAction={updatedItemAction}
            setItemAction={setUpdatedItemAction}
          />
          <SectionPurchasable
            item={updatedItem}
            setItem={setUpdatedItem}
            itemPrice={updatedItemPrice}
            setItemPrice={setUpdatedItemPrice}
          />
        </div>
      </div>
    </div>
  );
};

const useUpdateItem = (setStatus: (status: Status) => void) => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  // ITEM API
  const { data: items, isFetched: isItemFetched } = useItemsApi(true);

  const item = useMemo(
    () => items.find(i => i.id === id),
    [items, isItemFetched],
  );
  const [updatedItem, setUpdatedItem] = useState(item);
  useEffect(() => {
    setUpdatedItem(item);
  }, [isItemFetched]);

  // ITEM ACTION API
  const { data: itemAction = {}, isFetched: isItemActionFetched } =
    useItemActionsApi(id!);
  const [updatedItemAction, setUpdatedItemAction] = useState(itemAction);
  useEffect(() => {
    setUpdatedItemAction(itemAction);
  }, [isItemActionFetched]);

  // ITEM CRAFT API
  const { data: itemCraft = [], isFetched: isCraftFetched } =
    useItemCraftsApi(id);
  const [updatedItemCraft, setUpdatedItemCraft] = useState(itemCraft);
  useEffect(() => {
    setUpdatedItemCraft(itemCraft);
  }, [isCraftFetched]);

  // ITEM PRICE API
  const { data: itemPrice = [], isFetched: isPriceFetched } =
    useItemPriceApi(id);
  const [updatedItemPrice, setUpdatedItemPrice] = useState(itemPrice);
  useEffect(() => {
    setUpdatedItemPrice(itemPrice);
  }, [isPriceFetched]);

  // ITEM DROPS API
  const { data: drops, isFetched: isDropsFetched } = useMonsterDropsApi();
  const itemDrops = useMemo(() => {
    const monsters: {
      monsterId: string;
      level: number;
      chance: number;
      amount: number;
    }[] = [];
    drops.forEach(drop =>
      drop.drops.map(levelDrop => {
        const isDropped = levelDrop.drops.find(d => d.id === item?.id);
        if (isDropped)
          monsters.push({
            monsterId: drop.monsterId,
            level: levelDrop.level,
            chance: isDropped.chance,
            amount: isDropped.amount,
          });
      }),
    );
    return monsters;
  }, [drops, isDropsFetched]);

  // ITEM STATS API
  const { data: itemStats = DEFAULT_STATS, isFetched: isStatsFetched } =
    useItemStatsApi(updatedItem?.id ?? null);
  const [updatedItemStats, setUpdatedItemStats] = useState(itemStats);
  useEffect(() => {
    setUpdatedItemStats(itemStats);
  }, [isStatsFetched]);
  const {
    mutateItem,
    mutateItemStats,
    mutateItemCraft,
    mutateItemAction,
    mutateItemPrice,
  } = useStatus(setStatus);

  // OTHER
  const itemImg = useMemo(() => removeCdnUrl(updatedItem?.img), [items]);

  const onSave = () => {
    if (updatedItem)
      mutateItem({
        ...updatedItem,
        img: itemImg,
        levelRequirement: updatedItem.levelRequirement ?? 0,
      });
    if (updatedItemAction)
      mutateItemAction({ itemId: item!.id, ...updatedItemAction });
    if (updatedItemCraft?.length)
      mutateItemCraft({ itemId: item!.id, craftList: updatedItemCraft });
    if (updatedItemStats)
      mutateItemStats({ itemId: item!.id, stats: updatedItemStats });
    if (updatedItemPrice)
      mutateItemPrice({ itemId: item!.id, price: updatedItemPrice });
  };

  return {
    item,
    itemImg,
    updatedItem,
    updatedItemAction,
    updatedItemCraft,
    updatedItemPrice,
    updatedItemStats,
    itemDrops,
    setUpdatedItem,
    setUpdatedItemAction,
    setUpdatedItemCraft,
    setUpdatedItemPrice,
    setUpdatedItemStats,
    onSave,
  };
};

const useStatus = (setStatus: (status: Status) => void) => {
  // STATUS: ITEM
  const {
    mutate: mutateItem,
    isSuccess: isUpdateItemSuccess,
    isError: isUpdateItemError,
    isPending: isUpdateItemPending,
  } = useAdminUpdateItemApi();

  useEffect(() => {
    setStatus({
      isSuccess: isUpdateItemSuccess,
      isError: isUpdateItemError,
      isPending: isUpdateItemPending,
    });
  }, [isUpdateItemSuccess, isUpdateItemError, isUpdateItemPending]);

  // STATUS: ITEM STATS
  const {
    mutate: mutateItemStats,
    isSuccess: isUpdateStatsSuccess,
    isError: isUpdateStatsError,
    isPending: isUpdateStatsPending,
  } = useAdminUpdateItemStatsApi();

  useEffect(() => {
    setStatus({
      isSuccess: isUpdateStatsSuccess,
      isError: isUpdateStatsError,
      isPending: isUpdateStatsPending,
    });
  }, [isUpdateStatsSuccess, isUpdateStatsError, isUpdateStatsPending]);

  // STATUS: ITEM CRAFT
  const {
    mutate: mutateItemCraft,
    isSuccess: isUpdateCraftSuccess,
    isError: isUpdateCraftError,
    isPending: isUpdateCraftPending,
  } = useAdminUpdateItemCraftlistApi();

  useEffect(() => {
    setStatus({
      isSuccess: isUpdateCraftSuccess,
      isError: isUpdateCraftError,
      isPending: isUpdateCraftPending,
    });
  }, [isUpdateCraftSuccess, isUpdateCraftError, isUpdateCraftPending]);

  // STATUS: ITEM PRICE
  const {
    mutate: mutateItemPrice,
    isSuccess: isUpdatePriceSuccess,
    isError: isUpdatePriceError,
    isPending: isUpdatePricePending,
  } = useAdminUpdateItemPriceApi();

  useEffect(() => {
    setStatus({
      isSuccess: isUpdatePriceSuccess,
      isError: isUpdatePriceError,
      isPending: isUpdatePricePending,
    });
  }, [isUpdatePriceSuccess, isUpdatePriceError, isUpdatePricePending]);

  // STATUS: ITEM ACTION
  const {
    mutate: mutateItemAction,
    isSuccess: isUpdateActionSuccess,
    isError: isUpdateActionError,
    isPending: isUpdateActionPending,
  } = useAdminUpdateItemActionApi();

  useEffect(() => {
    setStatus({
      isSuccess: isUpdateActionSuccess,
      isError: isUpdateActionError,
      isPending: isUpdateActionPending,
    });
  }, [isUpdateActionSuccess, isUpdateActionError, isUpdateActionPending]);

  return {
    mutateItem,
    mutateItemStats,
    mutateItemCraft,
    mutateItemAction,
    mutateItemPrice,
  };
};
