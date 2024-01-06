import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CDN_URL } from '@mhgo/front/env';
import {
  Button,
  useAdminUpdateItemActionApi,
  useAdminUpdateItemApi,
  useAdminUpdateItemCraftlistApi,
  useAdminUpdateItemStatsApi,
  useItemActionsApi,
  useItemCraftsApi,
  useItemStatsApi,
  useItemsApi,
  useMonsterDropsApi,
} from '@mhgo/front';
import { ActionBar, HeaderEdit } from '../../../containers';
import { SectionBasic } from './SectionBasic';
import { SectionCraftable } from './SectionCraftable';
import { SectionEquippable } from './SectionEquippable';
import { SectionPurchasable } from './SectionPurchasable';
import { SectionUsable } from './SectionUsable';
import { NotExist } from './NotExist';

import s from './SingleItemView.module.scss';
import { DEFAULT_STATS } from '../../../utils/defaults';
import { Status } from '../../../utils/types';

export const ItemEditView = () => {
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
    updatedItemStats,
    itemImg,
    itemDrops,
    setUpdatedItem,
    setUpdatedItemAction,
    setUpdatedItemCraft,
    setUpdatedItemStats,
    onSave,
  } = useUpdateItem(setStatus);

  if (!item) return <NotExist />;

  return (
    <div className={s.singleItemView}>
      <HeaderEdit status={status} title="Edit item" />
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
          item={item}
          updatedItem={updatedItem}
          setUpdatedItem={setUpdatedItem}
          itemImg={itemImg}
          itemDrops={itemDrops}
        />
        <div className={s.singleItemView__content}>
          <SectionPurchasable
            updatedItem={updatedItem}
            setUpdatedItem={setUpdatedItem}
          />
          <SectionUsable
            updatedItem={updatedItem}
            setUpdatedItem={setUpdatedItem}
            updatedItemAction={updatedItemAction}
            setUpdatedItemAction={setUpdatedItemAction}
          />
          <SectionEquippable
            updatedItem={updatedItem}
            setUpdatedItem={setUpdatedItem}
            updatedItemStats={updatedItemStats}
            setUpdatedItemStats={setUpdatedItemStats}
          />
          <SectionCraftable
            item={item}
            updatedItem={updatedItem}
            setUpdatedItem={setUpdatedItem}
            updatedItemCraft={updatedItemCraft}
            setUpdatedItemCraft={setUpdatedItemCraft}
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
  const { data: items, isFetched: isItemFetched } = useItemsApi();
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

  // ITEM DROPS API
  const { data: drops, isFetched: isDropsFetched } = useMonsterDropsApi();
  const itemDrops = useMemo(() => {
    const monsters: { monsterId: string; level: number }[] = [];
    drops.forEach(drop =>
      drop.drops.map(levelDrop => {
        if (levelDrop.drops.some(d => d.id === item?.id))
          monsters.push({ monsterId: drop.monsterId, level: levelDrop.level });
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
  const { mutateItem, mutateItemStats, mutateItemCraft, mutateItemAction } =
    useStatus(setStatus);

  useEffect(() => {
    console.log(updatedItemStats);
  }, [updatedItemStats]);
  // OTHER
  const itemImg = useMemo(
    () => updatedItem?.img.replace(CDN_URL, '') ?? '',
    [items],
  );

  const onSave = () => {
    if (updatedItem) mutateItem({ ...updatedItem, img: itemImg });
    if (updatedItemAction)
      mutateItemAction({ itemId: item!.id, ...updatedItemAction });
    if (updatedItemCraft?.length)
      mutateItemCraft({ itemId: item!.id, craftList: updatedItemCraft });
    if (updatedItemStats)
      mutateItemStats({ itemId: item!.id, stats: updatedItemStats });
  };

  return {
    item,
    itemImg,
    updatedItem,
    updatedItemAction,
    updatedItemCraft,
    updatedItemStats,
    itemDrops,
    setUpdatedItem,
    setUpdatedItemAction,
    setUpdatedItemCraft,
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

  return { mutateItem, mutateItemStats, mutateItemCraft, mutateItemAction };
};
