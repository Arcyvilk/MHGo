import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControlLabel, Switch } from '@mui/material';

import { CDN_URL } from '@mhgo/front/env';
import { BaseWealth, HabitatType, MonsterDrop } from '@mhgo/types';
import {
  Button,
  Input,
  Select,
  useAdminUpdateMonsterApi,
  useMonstersApi,
  useAdminUpdateMonsterDropsApi,
  QueryBoundary,
  Loader,
  removeCdnUrl,
} from '@mhgo/front';
import { ActionBar, HeaderEdit, IconInfo } from '../../../containers';
import { Status } from '../../../utils/types';
import { MonsterDrops } from './MonsterDrops';

import s from './SingleMonsterView.module.scss';

export const MonsterEditView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const [updatedDrops, setUpdatedDrops] = useState<MonsterDrop['drops']>([]);
  const [status, setStatus] = useState({
    isSuccess: false,
    isError: false,
    isPending: false,
  });

  const navigate = useNavigate();
  const {
    monster,
    updatedMonster,
    setUpdatedMonster,
    monsterImg,
    monsterThumbnail,
    onSave,
  } = useUpdateMonster(updatedDrops, setStatus);

  if (!monster)
    return (
      <div className={s.singleMonsterView}>
        <div className={s.singleMonsterView__header}>
          <h1 className={s.singleMonsterView__title}>
            This monster does not exist!
          </h1>
        </div>
        <div className={s.singleMonsterView__footer}>
          <Button label="Back" onClick={() => navigate(-1)} />
        </div>
      </div>
    );

  return (
    <div className={s.singleMonsterView}>
      <HeaderEdit status={status} title="Edit monster" />
      <ActionBar
        title={`Monster ID: ${updatedMonster?.id}`}
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
      <div className={s.singleMonsterView__content}>
        <div className={s.singleMonsterView__content}>
          <div className={s.singleMonsterView__section}>
            <Input
              name="monster_name"
              label="Monster's name"
              value={updatedMonster?.name ?? ''}
              setValue={name =>
                updatedMonster &&
                setUpdatedMonster({
                  ...updatedMonster,
                  name,
                })
              }
            />
            <Input
              name="monster_desc"
              label="Monster's description"
              value={updatedMonster?.description ?? ''}
              setValue={description =>
                updatedMonster &&
                setUpdatedMonster({
                  ...updatedMonster,
                  description,
                })
              }
            />
            <Input
              name="monster_req"
              label="Monster spawn level requirement"
              type="number"
              min={0}
              value={String(updatedMonster?.levelRequirements ?? 0)}
              setValue={levelRequirements =>
                updatedMonster &&
                setUpdatedMonster({
                  ...updatedMonster,
                  levelRequirements: Number(levelRequirements),
                })
              }
            />
            <Select
              data={(
                ['swamp', 'forest', 'cave', 'desert'] as HabitatType[]
              ).map(item => ({
                id: item,
                name: item,
              }))}
              name="monster_habitat"
              label="Monster's habitat"
              defaultSelected={updatedMonster?.habitat}
              setValue={habitat =>
                updatedMonster &&
                setUpdatedMonster({
                  ...updatedMonster,
                  habitat,
                })
              }
            />
          </div>
          <div
            className={s.singleMonsterView__section}
            style={{ alignItems: 'center' }}>
            <Input
              name="monster_img"
              label="Path to monster image"
              value={monsterImg}
              setValue={img =>
                updatedMonster &&
                setUpdatedMonster({
                  ...updatedMonster,
                  img,
                })
              }
            />
            <img
              src={`${CDN_URL}${monsterImg}`}
              style={{ maxWidth: '256px' }}
            />
          </div>
          <div
            className={s.singleMonsterView__section}
            style={{ alignItems: 'center' }}>
            <Input
              name="monster_thumbnail"
              label="Path to monster thumbnail"
              value={monsterThumbnail}
              setValue={thumbnail =>
                updatedMonster &&
                setUpdatedMonster({
                  ...updatedMonster,
                  thumbnail,
                })
              }
            />
            <img
              src={`${CDN_URL}${monsterThumbnail}`}
              style={{ maxWidth: '64px' }}
            />
          </div>
        </div>
        <div className={s.singleMonsterView__content}>
          <div className={s.singleMonsterView__section}>
            <Input
              label={
                <span className={s.singleMonsterView__withInfo}>
                  <IconInfo tooltip="Base value is multiplied by monster level" />
                  Monster base HP
                </span>
              }
              name="monster_basehp"
              type="number"
              min={0}
              value={String(updatedMonster?.baseHP ?? 0)}
              setValue={baseHP =>
                updatedMonster &&
                setUpdatedMonster({
                  ...updatedMonster,
                  baseHP: Number(baseHP),
                })
              }
            />
            <Input
              label={
                <span className={s.singleMonsterView__withInfo}>
                  <IconInfo tooltip="Base value is multiplied by monster level" />
                  Monster base damage
                </span>
              }
              name="monster_basedmg"
              type="number"
              min={0}
              value={String(updatedMonster?.baseDamage ?? 0)}
              setValue={baseDamage =>
                updatedMonster &&
                setUpdatedMonster({
                  ...updatedMonster,
                  baseDamage: Number(baseDamage),
                })
              }
            />
            <Input
              label="Monster attack speed"
              name="monster_baseas"
              type="number"
              min={0}
              step={0.1}
              value={String(updatedMonster?.baseAttackSpeed ?? 0)}
              setValue={baseAttackSpeed =>
                updatedMonster &&
                setUpdatedMonster({
                  ...updatedMonster,
                  baseAttackSpeed: Number(baseAttackSpeed),
                })
              }
            />
            <div className={s.singleMonsterView__infoSection}>
              <p
                style={{ fontWeight: 600 }}
                className={s.singleMonsterView__withInfo}>
                Monster's base DPS:{' '}
                <span style={{ fontWeight: 900, fontSize: '14px' }}>
                  {(
                    (updatedMonster?.baseDamage ?? 0) *
                    (updatedMonster?.baseAttackSpeed ?? 0)
                  ).toFixed(1)}
                </span>
              </p>
            </div>
          </div>
          <div className={s.singleMonsterView__section}>
            <Input
              label={
                <span className={s.singleMonsterView__withInfo}>
                  <IconInfo tooltip="Base value is multiplied by monster level" />
                  Monster EXP drop (base)
                </span>
              }
              name="monster_baseexp"
              type="number"
              min={0}
              value={String(updatedMonster?.baseExp ?? 0)}
              setValue={baseExp =>
                updatedMonster &&
                setUpdatedMonster({
                  ...updatedMonster,
                  baseExp: Number(baseExp),
                })
              }
            />
            <Input
              label={
                <span className={s.singleMonsterView__withInfo}>
                  <IconInfo tooltip="Base value is multiplied by monster level" />
                  Monster basic currency drop (base)
                </span>
              }
              name="monster_basecurr"
              type="number"
              min={0}
              value={String(
                updatedMonster?.baseWealth.find(
                  wealth => wealth.type === 'base',
                )?.amount ?? 0,
              )}
              setValue={baseCurr => {
                if (!updatedMonster?.baseWealth) return;
                const newWealth: BaseWealth = {
                  type: 'base',
                  amount: Number(baseCurr),
                };
                setUpdatedMonster({
                  ...updatedMonster,
                  baseWealth: [
                    ...updatedMonster.baseWealth.filter(
                      wealth => wealth.type !== 'base',
                    ),
                    newWealth,
                  ],
                });
              }}
            />
            <Input
              label={
                <span className={s.singleMonsterView__withInfo}>
                  <IconInfo tooltip="Base value is multiplied by monster level" />
                  Monster premium currency drop (base)
                </span>
              }
              name="monster_premium"
              type="number"
              min={0}
              value={String(
                updatedMonster?.baseWealth.find(
                  wealth => wealth.type === 'premium',
                )?.amount ?? 0,
              )}
              setValue={baseCurr => {
                if (!updatedMonster?.baseWealth) return;
                const newWealth: BaseWealth = {
                  type: 'premium',
                  amount: Number(baseCurr),
                };
                setUpdatedMonster({
                  ...updatedMonster,
                  baseWealth: [
                    ...updatedMonster.baseWealth.filter(
                      wealth => wealth.type !== 'premium',
                    ),
                    newWealth,
                  ],
                });
              }}
            />
          </div>
          <div className={s.singleMonsterView__section}>
            <FormControlLabel
              label="Extinct?"
              control={
                <Switch
                  color="default"
                  checked={updatedMonster?.extinct}
                  onChange={(_, extinct) =>
                    updatedMonster &&
                    setUpdatedMonster({ ...updatedMonster, extinct })
                  }
                />
              }
            />
            <FormControlLabel
              label="Hidden in Monster Guide?"
              control={
                <Switch
                  color="default"
                  checked={updatedMonster?.hideInGuide}
                  onChange={(_, hideInGuide) =>
                    updatedMonster &&
                    setUpdatedMonster({ ...updatedMonster, hideInGuide })
                  }
                />
              }
            />
          </div>
        </div>
        <div className={s.singleMonsterView__content}>
          <MonsterDrops
            updatedDrops={updatedDrops}
            setUpdatedDrops={setUpdatedDrops}
          />
        </div>
      </div>
    </div>
  );
};

const useUpdateMonster = (
  updatedDrops: MonsterDrop['drops'],
  setStatus: (status: Status) => void,
) => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  const { data: monsters, isFetched: isMonsterFetched } = useMonstersApi(true);

  const monster = useMemo(
    () => monsters.find(i => i.id === id),
    [monsters, isMonsterFetched],
  );
  const [updatedMonster, setUpdatedMonster] = useState(monster);

  useEffect(() => {
    setUpdatedMonster(monster);
  }, [isMonsterFetched]);

  const { mutateMonster, mutateMonsterDrops } = useStatus(setStatus);

  const monsterImg = useMemo(
    () => removeCdnUrl(updatedMonster?.img),
    [monster],
  );
  const monsterThumbnail = useMemo(
    () => removeCdnUrl(updatedMonster?.thumbnail),
    [monster],
  );

  const onSave = () => {
    if (updatedMonster)
      mutateMonster({
        ...updatedMonster,
        img: monsterImg,
        thumbnail: monsterThumbnail,
        levelRequirements: updatedMonster.levelRequirements ?? null,
      });
    if (updatedDrops)
      mutateMonsterDrops({ monsterId: monster!.id, drops: updatedDrops });
  };

  return {
    monster,
    monsterImg,
    monsterThumbnail,
    updatedMonster,
    setUpdatedMonster,
    onSave,
  };
};

const useStatus = (setStatus: (status: Status) => void) => {
  const {
    mutate: mutateMonster,
    isSuccess: isSuccessMonster,
    isError: isErrorMonster,
    isPending: isPendingMonster,
  } = useAdminUpdateMonsterApi();

  const {
    mutate: mutateMonsterDrops,
    isSuccess: isSuccessDrops,
    isError: isErrorDrops,
    isPending: isPendingDrops,
  } = useAdminUpdateMonsterDropsApi();

  useEffect(() => {
    setStatus({
      isSuccess: isSuccessMonster,
      isError: isErrorMonster,
      isPending: isPendingMonster,
    });
  }, [isSuccessMonster, isErrorMonster, isPendingMonster]);

  useEffect(() => {
    setStatus({
      isSuccess: isSuccessDrops,
      isError: isErrorDrops,
      isPending: isPendingDrops,
    });
  }, [isSuccessDrops, isErrorDrops, isPendingDrops]);

  return { mutateMonster, mutateMonsterDrops };
};
