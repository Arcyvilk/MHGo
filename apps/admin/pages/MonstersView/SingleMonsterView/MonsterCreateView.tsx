import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControlLabel, Switch } from '@mui/material';

import { CDN_URL } from '@mhgo/front/env';
import { BaseWealth, BiomeType, Monster, MonsterDrop } from '@mhgo/types';
import {
  Button,
  Input,
  Loader,
  QueryBoundary,
  Select,
  removeCdnUrl,
  useAdminCreateMonsterApi,
} from '@mhgo/front';
import { MonsterDrops } from './MonsterDrops';
import { Status } from '../../../utils/types';
import { ActionBar, HeaderEdit, IconInfo } from '../../../containers';
import { DEFAULT_MONSTER } from '../../../utils/defaults';

import s from './SingleMonsterView.module.scss';

export const MonsterCreateView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const navigate = useNavigate();
  const [updatedDrops, setUpdatedDrops] = useState<MonsterDrop['drops']>([]);
  const [status, setStatus] = useState({
    isSuccess: false,
    isError: false,
    isPending: false,
  });

  const { monster, monsterImg, monsterThumbnail, setMonster, onCreate } =
    useUpdateMonster(updatedDrops, setStatus);

  return (
    <div className={s.singleMonsterView}>
      <HeaderEdit status={status} title="Create monster" hasBackButton={true} />
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
      <div className={s.singleMonsterView__content}>
        <div className={s.singleMonsterView__content}>
          <div className={s.singleMonsterView__section}>
            <Input
              name="monster_name"
              label="Monster's name"
              value={monster?.name ?? ''}
              setValue={name =>
                setMonster({
                  ...monster,
                  name,
                })
              }
            />
            <Input
              name="monster_desc"
              label="Monster's description"
              value={monster?.description ?? ''}
              setValue={description =>
                setMonster({
                  ...monster,
                  description,
                })
              }
            />
            <Input
              name="monster_req"
              label="Monster spawn level requirement"
              type="number"
              min={0}
              value={String(monster?.levelRequirements ?? 0)}
              setValue={levelRequirements =>
                setMonster({
                  ...monster,
                  levelRequirements: Number(levelRequirements),
                })
              }
            />
            <Select
              data={(
                ['swamp', 'forest', 'cave', 'desert'] as BiomeType[]
              ).map(item => ({
                id: item,
                name: item,
              }))}
              name="monster_biome"
              label="Monster's biome"
              defaultSelected={monster?.biome}
              setValue={biome =>
                setMonster({
                  ...monster,
                  biome,
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
                setMonster({
                  ...monster,
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
                setMonster({
                  ...monster,
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
              value={String(monster?.baseHP ?? 0)}
              setValue={baseHP =>
                setMonster({
                  ...monster,
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
              value={String(monster?.baseDamage ?? 0)}
              setValue={baseDamage =>
                setMonster({
                  ...monster,
                  baseDamage: Number(baseDamage),
                })
              }
            />
            <Input
              label={
                <span className={s.singleMonsterView__withInfo}>
                  <IconInfo tooltip="Base value is multiplied by monster level" />
                  Monster base attack speed
                </span>
              }
              name="monster_baseas"
              type="number"
              min={0}
              step={0.1}
              value={String(monster?.baseAttackSpeed ?? 0)}
              setValue={baseAttackSpeed =>
                setMonster({
                  ...monster,
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
                    (monster?.baseDamage ?? 0) * (monster?.baseAttackSpeed ?? 0)
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
              value={String(monster?.baseExp ?? 0)}
              setValue={baseExp =>
                setMonster({
                  ...monster,
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
                monster?.baseWealth.find(wealth => wealth.type === 'base')
                  ?.amount ?? 0,
              )}
              setValue={baseCurr => {
                if (!monster?.baseWealth) return;
                const newWealth: BaseWealth = {
                  type: 'base',
                  amount: Number(baseCurr),
                };
                setMonster({
                  ...monster,
                  baseWealth: [
                    ...monster.baseWealth.filter(
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
                monster?.baseWealth.find(wealth => wealth.type === 'premium')
                  ?.amount ?? 0,
              )}
              setValue={baseCurr => {
                if (!monster?.baseWealth) return;
                const newWealth: BaseWealth = {
                  type: 'premium',
                  amount: Number(baseCurr),
                };
                setMonster({
                  ...monster,
                  baseWealth: [
                    ...monster.baseWealth.filter(
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
                  checked={monster.extinct}
                  onChange={(_, extinct) => setMonster({ ...monster, extinct })}
                />
              }
            />
            <FormControlLabel
              label="Hidden in Monster Guide?"
              control={
                <Switch
                  color="default"
                  checked={monster?.hideInGuide}
                  onChange={(_, hideInGuide) =>
                    setMonster({ ...monster, hideInGuide })
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
  const [monster, setMonster] = useState<Monster>(DEFAULT_MONSTER);
  const { mutate } = useStatus(setStatus);

  const monsterImg = useMemo(() => removeCdnUrl(monster?.img), [monster]);
  const monsterThumbnail = useMemo(
    () => removeCdnUrl(monster?.thumbnail),
    [monster],
  );

  const onCreate = () => {
    if (monster) {
      const monsterId = monster.name.toLowerCase().replace(/ /g, '_');
      mutate({
        monster: {
          ...monster,
          id: monsterId,
          img: monsterImg,
          thumbnail: monsterThumbnail,
          levelRequirements: monster.levelRequirements ?? null,
        },
        drops: { monsterId, drops: updatedDrops },
      });
    }
  };

  return {
    monster,
    setMonster,
    monsterImg,
    monsterThumbnail,
    onCreate,
  };
};

const useStatus = (setStatus: (status: Status) => void) => {
  const { mutate, isSuccess, isError, isPending } = useAdminCreateMonsterApi();

  useEffect(() => {
    setStatus({
      isSuccess,
      isError,
      isPending,
    });
  }, [isSuccess, isError, isPending]);

  return { mutate };
};
