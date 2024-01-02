import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CDN_URL } from '@mhgo/front/env';
import { HabitatType, Monster } from '@mhgo/types';
import { Button, Input, Select, useAdminCreateMonsterApi } from '@mhgo/front';
import { ActionBar, HeaderEdit, IconInfo } from '../../../containers';
import { DEFAULT_MONSTER } from '../../../utils/defaults';

import s from './SingleMonsterView.module.scss';

export const MonsterCreateView = () => {
  const navigate = useNavigate();
  const {
    monster,
    monsterImg,
    monsterThumbnail,
    onTextPropertyChange,
    onNumberPropertyChange,
    onSelectionPropertyChange,
    onCreate,
    isSuccess,
    isPending,
    isError,
  } = useUpdateMonster();
  const status = { isSuccess, isPending, isError };

  return (
    <div className={s.singleMonsterView}>
      <HeaderEdit status={status} title="Create monster" />
      <ActionBar
        buttons={
          <>
            <Button
              label="Cancel"
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
              setValue={newName => onTextPropertyChange(newName, 'name')}
            />
            <Input
              name="monster_desc"
              label="Monster's description"
              value={monster?.description ?? ''}
              setValue={newDesc => onTextPropertyChange(newDesc, 'description')}
            />
            <Input
              name="monster_req"
              label="Monster spawn level requirement"
              min={0}
              value={String(monster?.levelRequirements ?? 0)}
              setValue={newRequirement =>
                onNumberPropertyChange(newRequirement, 'levelRequirements')
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
              defaultSelected={monster?.habitat}
              setValue={newHabitat =>
                onSelectionPropertyChange(newHabitat as HabitatType)
              }
            />
            <div className={s.singleMonsterView__infoSection}>
              <p
                style={{ fontWeight: 600 }}
                className={s.singleMonsterView__withInfo}>
                <IconInfo tooltip="Base value is multiplied by monster level" />{' '}
                Monster's DPS (base attack * base AS)
              </p>
              <p style={{ fontWeight: 900, fontSize: '14px' }}>
                {(monster?.baseDamage ?? 0) * (monster?.baseAttackSpeed ?? 0)}
              </p>
            </div>
          </div>
          <div
            className={s.singleMonsterView__section}
            style={{ alignItems: 'center' }}>
            <Input
              name="monster_img"
              label="Path to monster image"
              value={monsterImg}
              setValue={newPath => onTextPropertyChange(newPath, 'img')}
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
              setValue={newPath => onTextPropertyChange(newPath, 'thumbnail')}
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
              setValue={newPrice => onNumberPropertyChange(newPrice, 'baseHP')}
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
              setValue={newPrice =>
                onNumberPropertyChange(newPrice, 'baseDamage')
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
              value={String(monster?.baseAttackSpeed ?? 0)}
              setValue={newPrice =>
                onNumberPropertyChange(newPrice, 'baseAttackSpeed')
              }
            />
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
              setValue={newPrice => onNumberPropertyChange(newPrice, 'baseExp')}
            />
            {/* TODO monster currency drops */}
            <Input
              disabled
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
              setValue={newPrice => onNumberPropertyChange(newPrice, 'baseExp')}
            />
            <Input
              disabled
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
              setValue={newPrice => onNumberPropertyChange(newPrice, 'baseExp')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const useUpdateMonster = () => {
  const [monster, setMonster] = useState<Monster>(DEFAULT_MONSTER);

  const { mutate, isSuccess, isError, isPending } = useAdminCreateMonsterApi();

  const monsterImg = useMemo(
    () => monster?.img.replace(CDN_URL, '') ?? '',
    [monster],
  );
  const monsterThumbnail = useMemo(
    () => monster?.thumbnail.replace(CDN_URL, '') ?? '',
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
        drops: { monsterId, drops: [] },
      });
    }
  };

  const onTextPropertyChange = (
    newValue: string,
    property: keyof Pick<Monster, 'name' | 'description' | 'img' | 'thumbnail'>,
  ) => {
    if (!monster) return;
    setMonster({
      ...monster,
      [property]: newValue,
    });
  };

  const onNumberPropertyChange = (
    newValue: string,
    property: keyof Pick<
      Monster,
      | 'baseAttackSpeed'
      | 'baseDamage'
      | 'baseExp'
      | 'baseHP'
      | 'levelRequirements'
    >,
  ) => {
    if (!monster) return;
    setMonster({
      ...monster,
      [property]: Number(newValue),
    });
  };

  const onSelectionPropertyChange = (
    newKey: string, // TODO this will be used for habitat
    newValue?: string | number,
  ) => {
    if (!monster) return;
    setMonster({
      ...monster,
      [newKey]: Number(newValue),
    });
  };

  return {
    monster,
    monsterImg,
    monsterThumbnail,
    onTextPropertyChange,
    onNumberPropertyChange,
    onSelectionPropertyChange,
    onCreate,
    isSuccess,
    isPending,
    isError,
  };
};