import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CDN_URL } from '@mhgo/front/env';
import {
  Button,
  useAdminUpdateItemActionApi,
  useAdminUpdateItemApi,
  useAdminUpdateItemCraftlistApi,
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

export const ItemEditView = () => {
  const navigate = useNavigate();
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
    isSuccess,
    isPending,
    isError,
  } = useUpdateItem();
  const status = { isSuccess, isPending, isError };

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

const useUpdateItem = () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  /**
   * ITEM API
   */
  const { data: items, isFetched: isItemFetched } = useItemsApi();
  const {
    mutate: mutateItem,
    isSuccess: isUpdateItemSuccess,
    isError: isUpdateItemError,
    isPending: isUpdateItemPending,
  } = useAdminUpdateItemApi();

  const item = useMemo(
    () => items.find(i => i.id === id),
    [items, isItemFetched],
  );

  const [updatedItem, setUpdatedItem] = useState(item);

  useEffect(() => {
    setUpdatedItem(item);
  }, [isItemFetched]);

  /**
   * ITEM ACTION API
   */
  const { data: itemAction = {}, isFetched: isItemActionFetched } =
    useItemActionsApi(id!);
  const [updatedItemAction, setUpdatedItemAction] = useState(itemAction);
  const {
    mutate: mutateItemAction,
    isSuccess: isUpdateActionSuccess,
    isError: isUpdateActionError,
    isPending: isUpdateActionPending,
  } = useAdminUpdateItemActionApi();

  useEffect(() => {
    setUpdatedItemAction(itemAction);
  }, [isItemActionFetched]);

  /**
   * ITEM CRAFT API
   */
  const { data: itemCraft = [], isFetched: isCraftFetched } =
    useItemCraftsApi(id);
  const [updatedItemCraft, setUpdatedItemCraft] = useState(itemCraft);
  const {
    mutate: mutateItemCraft,
    isSuccess: isUpdateCraftSuccess,
    isError: isUpdateCraftError,
    isPending: isUpdateCraftPending,
  } = useAdminUpdateItemCraftlistApi();

  useEffect(() => {
    setUpdatedItemCraft(itemCraft);
  }, [isCraftFetched]);

  /**
   * ITEM DROPS API
   */
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

  /**
   * ITEM STATS API
   */
  const { data: itemStats = DEFAULT_STATS, isFetched: isStatsFetched } =
    useItemStatsApi(updatedItem?.id ?? null);
  const [updatedItemStats, setUpdatedItemStats] = useState(itemStats);
  useEffect(() => {
    setUpdatedItemStats(itemStats);
  }, [isStatsFetched]);
  // const {
  //   mutate: mutateItemStats,
  //   isSuccess: isUpdateStatsSuccess,
  //   isError: isUpdateStatsError,
  //   isPending: isUpdateStatsPending,
  // } = useAdminUpdateItemStatsApi();

  const itemImg = useMemo(
    () => updatedItem?.img.replace(CDN_URL, '') ?? '',
    [items],
  );

  const onSave = () => {
    if (updatedItem) mutateItem({ ...updatedItem, img: itemImg });
    if (updatedItemAction)
      mutateItemAction({ itemId: item!.id, ...updatedItemAction });
    if (updatedItemCraft) {
      mutateItemCraft({ itemId: item!.id, craftList: updatedItemCraft });
    }
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
    isSuccess:
      isUpdateActionSuccess && isUpdateItemSuccess && isUpdateCraftSuccess,
    isPending:
      isUpdateActionPending || isUpdateItemPending || isUpdateCraftPending,
    isError: isUpdateActionError || isUpdateItemError || isUpdateCraftError,
  };
};
