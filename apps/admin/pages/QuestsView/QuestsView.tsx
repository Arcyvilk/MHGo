import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@mui/material';
import { CDN_URL } from '@mhgo/front/env';

import {
  Button,
  Icon,
  Loader,
  QueryBoundary,
  Size,
  useAdminGetAllQuestsDailyApi,
  // useAdminGetAllQuestsStoryApi,
} from '@mhgo/front';
import { Quest } from '@mhgo/types';

import { useAppContext } from '../../utils/context';
import { ActionBar, HeaderEdit, Table, TableHeader } from '../../containers';

import s from './QuestsView.module.scss';

const tableHeaders: TableHeader<Quest>[] = [
  { id: 'enabled', label: '' },
  { id: 'title', label: 'Title' },
  { id: 'levelRequirement', label: 'LVL req.' },
  { id: 'exp', label: 'Exp' },
  { id: 'rewards', label: 'Admin' },
  { id: 'payment', label: 'Awaiting approval' },
  { id: 'actions', label: 'Actions' },
];

export const QuestsView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const {
    orderQuest: order,
    setOrderQuest: setOrder,
    orderByQuest: orderBy,
    setOrderByQuest: setOrderBy,
  } = useAppContext();
  const navigate = useNavigate();
  const { data: questsDaily } = useAdminGetAllQuestsDailyApi();
  // const { data: questsStory } = useAdminGetAllQuestsStoryApi();

  const [status, setStatus] = useState({
    isSuccess: false,
    isError: false,
    isPending: false,
  });

  // const { updatedQuests, setUpdatedQuests, onSave } =
  //   useUpdateQuests(setStatus);

  const sortedQuests = useMemo(() => {
    if (order && orderBy)
      return questsDaily.sort((a, b) =>
        order === 'asc'
          ? (a[orderBy] ?? 0) > (b[orderBy] ?? 0)
            ? 1
            : -1
          : (a[orderBy] ?? 0) < (b[orderBy] ?? 0)
            ? 1
            : -1,
      );
    else return questsDaily;
  }, [questsDaily, order, orderBy]);

  const onQuestEdit = (quest: Quest) => {
    navigate(`/quests/edit?id=${quest.id}`);
  };

  const onSwitch = (checked: boolean, quest: Quest, property: keyof Quest) => {
    const updatedQuest = {
      ...quest,
      [property]: checked,
    };
    // mutate(updatedQuest);
  };

  const tableRows = sortedQuests.map(quest => [
    <Switch
      color="default"
      checked={quest.enabled}
      onChange={(_, checked) => onSwitch(checked, quest, 'enabled')}
    />,
    <ItemCell quest={quest} />,
    quest.levelRequirement,
    quest.exp,
    quest.rewards.map(reward => `${reward.type}: ${reward.amount}`).join('; '),
    quest.payment.map(payment => `${payment.id}: ${payment.amount}`).join('; '),
    <Button
      label={<Icon icon="Edit" size={Size.MICRO} />}
      onClick={() => onQuestEdit(quest)}
      style={{ width: '40px' }}
    />,
  ]);

  return (
    <div className={s.questsView}>
      <HeaderEdit status={status} title="Quests" />
      <ActionBar
        buttons={
          <>
            <Button
              label="Create new quest"
              onClick={() => navigate('create')}
            />
          </>
        }
      />
      <div className={s.questsView__content}>
        <Table
          tableHeaders={tableHeaders}
          items={tableRows}
          order={order}
          setOrder={setOrder}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
        />
      </div>
    </div>
  );
};

const ItemCell = ({ quest }: { quest: Quest }) => {
  return (
    <div className={s.questsView__questDetail}>
      <img
        src={`${CDN_URL}/${quest.img}`}
        className={s.questsView__questIcon}
      />{' '}
      {quest.title}
    </div>
  );
};
