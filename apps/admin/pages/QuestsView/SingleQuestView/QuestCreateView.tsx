import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CDN_URL } from '@mhgo/front/env';
import { Quest } from '@mhgo/types';
import {
  Button,
  Input,
  Item,
  Loader,
  QueryBoundary,
  removeCdnUrl,
  useAdminCreateQuestApi,
} from '@mhgo/front';

import { ActionBar, HeaderEdit } from '../../../containers';
import { DEFAULT_MATERIAL } from '../../../utils/defaults';

import s from './SingleQuestView.module.scss';

export const QuestCreateView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const navigate = useNavigate();
  const {
    quest,
    questImg,
    onTextPropertyChange,
    onNumberPropertyChange,
    onCreate,
    isSuccess,
    isPending,
    isError,
  } = useUpdateQuest();

  return (
    <div className={s.singleQuestView}>
      <HeaderEdit
        status={{ isSuccess, isPending, isError }}
        title="Edit quest"
      />
      <ActionBar
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
              label="Create"
              onClick={onCreate}
              variant={Button.Variant.ACTION}
            />
          </>
        }
      />
      <div className={s.singleQuestView__content}>
        <div className={s.singleQuestView__content}>
          <div className={s.singleQuestView__section}>
            <Input
              name="quest_name"
              label="Quest's name"
              value={quest?.name ?? ''}
              setValue={newName => onTextPropertyChange(newName, 'name')}
            />
            <Input
              name="quest_desc"
              label="Quest's description"
              value={quest?.description ?? ''}
              setValue={newDesc => onTextPropertyChange(newDesc, 'description')}
            />
            {/* <Input
              name="quest_obtainedAt"
              label="Where quest can be obtained?"
              value={quest?.obtainedAt ?? ''}
              setValue={newObtained =>
                onTextPropertyChange(newObtained, 'obtainedAt')
              }
            /> */}
            <Input
              name="quest_rarity"
              label="Quest's rarity"
              min={1}
              max={6}
              type="number"
              value={String(quest?.rarity ?? 1)}
              setValue={newRarity =>
                onNumberPropertyChange(newRarity, 'rarity')
              }
            />
          </div>
          <div
            className={s.singleQuestView__section}
            style={{ alignItems: 'center' }}>
            <Input
              name="quest_img"
              label="Path to quest image"
              value={questImg}
              setValue={newPath => onTextPropertyChange(newPath, 'img')}
            />
            <Item
              data={{
                ...(quest ?? quest),
                purchasable: false,
                img: `${CDN_URL}${questImg}`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const useUpdateQuest = () => {
  const [quest, setQuest] = useState<Quest>(DEFAULT_MATERIAL);

  const { mutate, isSuccess, isError, isPending } = useAdminCreateQuestApi();

  const questImg = useMemo(() => removeCdnUrl(quest?.img), [quest]);

  const onCreate = () => {
    if (quest)
      mutate({
        ...quest,
        img: questImg,
      });
  };

  const onTextPropertyChange = (newValue: string, property: keyof Quest) => {
    if (!quest) return;
    setQuest({
      ...quest,
      [property]: newValue,
    });
  };

  const onNumberPropertyChange = (newValue: string, property: keyof Quest) => {
    if (!quest) return;
    setQuest({
      ...quest,
      [property]: Number(newValue),
    });
  };

  return {
    quest,
    questImg,
    onTextPropertyChange,
    onNumberPropertyChange,
    onCreate,
    isSuccess,
    isPending,
    isError,
  };
};
