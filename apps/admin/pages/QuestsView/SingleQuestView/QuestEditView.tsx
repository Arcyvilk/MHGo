import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CDN_URL } from '@mhgo/front/env';
import {
  Button,
  Input,
  Item,
  Loader,
  QueryBoundary,
  removeCdnUrl,
  useAdminUpdateQuestApi,
  useAdminGetAllQuestsDailyApi,
} from '@mhgo/front';
import { ActionBar, HeaderEdit } from '../../../containers';

import s from './SingleQuestView.module.scss';

export const QuestEditView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const navigate = useNavigate();
  const {
    quest,
    updatedQuest,
    questImg,
    setUpdatedQuest,
    onSave,
    isSuccess,
    isPending,
    isError,
  } = useUpdateQuest();

  if (!quest)
    return (
      <div className={s.singleQuestView}>
        <div className={s.singleQuestView__header}>
          <h1 className={s.singleQuestView__title}>
            This quest does not exist!
          </h1>
        </div>
        <div className={s.singleQuestView__footer}>
          <Button label="Back" onClick={() => navigate(-1)} />
        </div>
      </div>
    );

  return (
    <div className={s.singleQuestView}>
      <HeaderEdit
        status={{ isSuccess, isPending, isError }}
        title="Edit quest"
      />
      <ActionBar
        title={`Quest ID: ${updatedQuest?.id}`}
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
      <div className={s.singleQuestView__content}>
        <div className={s.singleQuestView__content}>
          <div className={s.singleQuestView__section}>
            <Input
              name="quest_title"
              label="Quest's title"
              value={updatedQuest?.title ?? ''}
              setValue={title =>
                updatedQuest && setUpdatedQuest({ ...updatedQuest, title })
              }
            />
            <div
              className={s.singleQuestView__section}
              style={{ alignItems: 'center' }}>
              <Input
                name="quest_img"
                label="Path to quest image"
                value={questImg}
                setValue={img =>
                  updatedQuest && setUpdatedQuest({ ...updatedQuest, img })
                }
              />
              <img
                src={`${CDN_URL}${questImg}`}
                style={{ maxWidth: '256px' }}
              />
            </div>
          </div>
          <div className={s.singleQuestView__section}>
            <Input
              name="quest_max_progress"
              label="Quest's max progress"
              min={1}
              type="number"
              value={String(updatedQuest?.maxProgress ?? 1)}
              setValue={maxProgress =>
                updatedQuest &&
                setUpdatedQuest({
                  ...updatedQuest,
                  maxProgress: Number(maxProgress),
                })
              }
            />
            <Input
              name="quest_exp"
              label="Quest's exp reward"
              min={0}
              type="number"
              value={String(updatedQuest?.exp ?? 1)}
              setValue={exp =>
                updatedQuest &&
                setUpdatedQuest({
                  ...updatedQuest,
                  exp: Number(exp),
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const useUpdateQuest = () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  const { data: quests, isFetched: isQuestsFetched } =
    useAdminGetAllQuestsDailyApi();

  const quest = useMemo(
    () => quests.find(i => i.id === id),
    [quests, isQuestsFetched],
  );
  const [updatedQuest, setUpdatedQuest] = useState(quest);

  const { mutate, isSuccess, isError, isPending } = useAdminUpdateQuestApi();

  const questImg = useMemo(() => removeCdnUrl(updatedQuest?.img), [quests]);

  const onSave = () => {
    if (updatedQuest)
      mutate({
        ...updatedQuest,
        img: questImg,
      });
  };

  return {
    quest,
    questImg,
    updatedQuest,
    setUpdatedQuest,
    onSave,
    isSuccess,
    isPending,
    isError,
  };
};
