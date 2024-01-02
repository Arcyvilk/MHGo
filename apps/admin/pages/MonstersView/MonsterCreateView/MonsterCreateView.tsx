import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { CDN_URL } from '@mhgo/front/env';
import { HabitatType, Monster } from '@mhgo/types';
import { Button, Input, Select, useAdminCreateMonsterApi } from '@mhgo/front';
import { ActionBar, HeaderEdit } from '../../../containers';
import { DEFAULT_MONSTER } from '../../../utils/defaults';

import s from './MonsterCreateView.module.scss';

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
    <div className={s.monsterCreateView}>
      <HeaderEdit status={status} title="Create monster" />
      <ActionBar
        buttons={
          <>
            <Button
              label="Cancel"
              onClick={() => navigate(-1)}
              variant={Button.Variant.DANGER}
            />
            <Button
              label="Create"
              onClick={onCreate}
              variant={Button.Variant.ACTION}
            />
          </>
        }
      />
      <div className={s.monsterCreateView__content}>
        <div className={s.monsterCreateView__content}>
          <div className={s.monsterCreateView__section}>
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
          </div>
          <div
            className={s.monsterCreateView__section}
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
            className={s.monsterCreateView__section}
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
        <div className={s.monsterCreateView__content}>
          <div className={s.monsterCreateView__section}>
            <Input
              label="Monster base HP"
              name="monster_basehp"
              type="number"
              min={0}
              value={String(monster?.baseHP ?? 0)}
              setValue={newPrice => onNumberPropertyChange(newPrice, 'baseHP')}
            />
            <Input
              label="Monster base damage"
              name="monster_basedmg"
              type="number"
              min={0}
              value={String(monster?.baseDamage ?? 0)}
              setValue={newPrice =>
                onNumberPropertyChange(newPrice, 'baseDamage')
              }
            />
            <Input
              label="Monster base attack speed"
              name="monster_baseas"
              type="number"
              min={0}
              value={String(monster?.baseAttackSpeed ?? 0)}
              setValue={newPrice =>
                onNumberPropertyChange(newPrice, 'baseAttackSpeed')
              }
            />
          </div>
          <div className={s.monsterCreateView__section}>
            <Input
              label="Monster base EXP dropped"
              name="monster_baseexp"
              type="number"
              min={0}
              value={String(monster?.baseExp ?? 0)}
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
      const monsterId = monster.name.toLowerCase().replace(' ', '_');
      mutate({
        monster: { ...monster, id: monsterId },
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
      'baseAttackSpeed' | 'baseDamage' | 'baseExp' | 'baseHP'
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
