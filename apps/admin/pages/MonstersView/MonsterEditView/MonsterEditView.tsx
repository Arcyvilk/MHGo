import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CDN_URL } from '@mhgo/front/env';
import { HabitatType, Monster } from '@mhgo/types';
import {
  Button,
  Icon,
  Input,
  Select,
  Size,
  Tooltip,
  useAdminUpdateMonsterApi,
  useMonstersApi,
} from '@mhgo/front';
import { ActionBar, HeaderEdit } from '../../../containers';

import s from './MonsterEditView.module.scss';

export const MonsterEditView = () => {
  const navigate = useNavigate();
  const {
    monster,
    updatedMonster,
    monsterImg,
    monsterThumbnail,
    onTextPropertyChange,
    onNumberPropertyChange,
    onSave,
    isSuccess,
    isPending,
    isError,
  } = useUpdateMonster();
  const status = { isSuccess, isPending, isError };

  if (!monster)
    return (
      <div className={s.monsterEditView}>
        <div className={s.monsterEditView__header}>
          <h1 className={s.monsterEditView__title}>
            This monster does not exist!
          </h1>
        </div>
        <div className={s.monsterEditView__footer}>
          <Button label="Back" onClick={() => navigate(-1)} />
        </div>
      </div>
    );

  return (
    <div className={s.monsterEditView}>
      <HeaderEdit status={status} title="Edit monster" />
      <ActionBar
        title={`Monster ID: ${updatedMonster?.id}`}
        buttons={
          <>
            <Button
              label="Cancel"
              onClick={() => navigate(-1)}
              variant={Button.Variant.DANGER}
            />
            <Button
              label="Save"
              onClick={onSave}
              variant={Button.Variant.ACTION}
            />
          </>
        }
      />
      <div className={s.monsterEditView__content}>
        <div className={s.monsterEditView__content}>
          <div className={s.monsterEditView__section}>
            <Input
              name="monster_name"
              label="Monster's name"
              value={updatedMonster?.name ?? ''}
              setValue={newName => onTextPropertyChange(newName, 'name')}
            />
            <Input
              name="monster_desc"
              label="Monster's description"
              value={updatedMonster?.description ?? ''}
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
              defaultSelected={updatedMonster?.habitat}
              setValue={newHabitat =>
                onTextPropertyChange(newHabitat, 'habitat')
              }
            />
            <div className={s.monsterEditView__infoSection}>
              <p
                style={{ fontWeight: 600 }}
                className={s.monsterEditView__withInfo}>
                <IconInfo /> Monster's base DPS (base attack * base AS)
              </p>
              <p style={{ fontWeight: 900, fontSize: '14px' }}>
                {(updatedMonster?.baseDamage ?? 0) *
                  (updatedMonster?.baseAttackSpeed ?? 0)}
              </p>
            </div>
          </div>
          <div
            className={s.monsterEditView__section}
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
            className={s.monsterEditView__section}
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
        <div className={s.monsterEditView__content}>
          <div className={s.monsterEditView__section}>
            <Input
              label={
                <span className={s.monsterEditView__withInfo}>
                  <IconInfo />
                  Monster base HP
                </span>
              }
              name="monster_basehp"
              type="number"
              min={0}
              value={String(updatedMonster?.baseHP ?? 0)}
              setValue={newPrice => onNumberPropertyChange(newPrice, 'baseHP')}
            />
            <Input
              label={
                <span className={s.monsterEditView__withInfo}>
                  <IconInfo />
                  Monster base damage
                </span>
              }
              name="monster_basedmg"
              type="number"
              min={0}
              value={String(updatedMonster?.baseDamage ?? 0)}
              setValue={newPrice =>
                onNumberPropertyChange(newPrice, 'baseDamage')
              }
            />
            <Input
              label={
                <span className={s.monsterEditView__withInfo}>
                  <IconInfo />
                  Monster base attack speed (attacks per second)
                </span>
              }
              name="monster_baseas"
              type="number"
              min={0}
              value={String(updatedMonster?.baseAttackSpeed ?? 0)}
              setValue={newPrice =>
                onNumberPropertyChange(newPrice, 'baseAttackSpeed')
              }
            />
          </div>
          <div className={s.monsterEditView__section}>
            <Input
              disabled
              label={
                <span className={s.monsterEditView__withInfo}>
                  <IconInfo />
                  Monster EXP drop (base)
                </span>
              }
              name="monster_baseexp"
              type="number"
              min={0}
              value={String(updatedMonster?.baseExp ?? 0)}
              setValue={newPrice => onNumberPropertyChange(newPrice, 'baseExp')}
            />
            <Input
              disabled
              label={
                <span className={s.monsterEditView__withInfo}>
                  <IconInfo />
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
              setValue={newPrice => onNumberPropertyChange(newPrice, 'baseExp')}
            />
            <Input
              disabled
              label={
                <span className={s.monsterEditView__withInfo}>
                  <IconInfo />
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
              setValue={newPrice => onNumberPropertyChange(newPrice, 'baseExp')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const useUpdateMonster = () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  const { data: monsters, isFetched: isMonsterFetched } = useMonstersApi();

  const monster = useMemo(
    () => monsters.find(i => i.id === id),
    [monsters, isMonsterFetched],
  );
  const [updatedMonster, setUpdatedMonster] = useState(monster);

  useEffect(() => {
    setUpdatedMonster(monster);
  }, [isMonsterFetched]);

  const { mutate, isSuccess, isError, isPending } = useAdminUpdateMonsterApi();

  const monsterImg = useMemo(
    () => updatedMonster?.img.replace(CDN_URL, '') ?? '',
    [monsters],
  );
  const monsterThumbnail = useMemo(
    () => updatedMonster?.thumbnail.replace(CDN_URL, '') ?? '',
    [monsters],
  );

  const onSave = () => {
    if (updatedMonster) {
      mutate(updatedMonster);
    }
  };

  const onTextPropertyChange = (
    newValue: string,
    property: keyof Pick<
      Monster,
      'name' | 'description' | 'img' | 'thumbnail' | 'habitat'
    >,
  ) => {
    if (!updatedMonster) return;
    setUpdatedMonster({
      ...updatedMonster,
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
    if (!updatedMonster) return;
    setUpdatedMonster({
      ...updatedMonster,
      [property]: Number(newValue),
    });
  };

  const onSelectionPropertyChange = (
    newKey: string, // TODO this will be used for habitat
    newValue?: string | number,
  ) => {
    if (!updatedMonster) return;
    setUpdatedMonster({
      ...updatedMonster,
      [newKey]: Number(newValue),
    });
  };

  return {
    monster,
    monsterImg,
    monsterThumbnail,
    updatedMonster,
    onTextPropertyChange,
    onNumberPropertyChange,
    onSelectionPropertyChange,
    onSave,
    isSuccess,
    isPending,
    isError,
  };
};

const IconInfo = () => {
  return (
    <Tooltip content="Base value is multiplied by monster level">
      <Icon icon="Info" size={Size.MICRO} />
    </Tooltip>
  );
};
