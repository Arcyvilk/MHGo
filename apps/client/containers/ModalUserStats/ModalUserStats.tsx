import { Modal, Tooltip, modifiers, useSettingsApi } from '@mhgo/front';
import { StatsWithSpecialEffect } from '@mhgo/types';

import { DEFAULT_SPECIAL_EFFECT_MAX_POINTS } from '../../utils/consts';
import s from './ModalUserStats.module.scss';

type ModalProps = {
  userStats: StatsWithSpecialEffect;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};
export const ModalUserStats = ({
  userStats,
  isOpen,
  setIsOpen,
}: ModalProps) => {
  const { setting: specialEffectMaxPoints } = useSettingsApi<number>(
    'special_effect_max_points',
    DEFAULT_SPECIAL_EFFECT_MAX_POINTS,
  );
  const { specialEffects } = userStats;
  const specialEffectsArray = Object.entries(specialEffects);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={s.modalUserStats}>
        <div className={s.modalUserStats__title}>Special effects:</div>

        {specialEffectsArray.length ? (
          specialEffectsArray.map(([key, value]) => (
            <SpecialEffect
              name={key}
              value={value}
              maxPoints={specialEffectMaxPoints!}
            />
          ))
        ) : (
          <span className={s.modalUserStats__noStats}>
            You don't have any special effects right now. Experiment with
            various loadout to discover some!
          </span>
        )}
      </div>
    </Modal>
  );
};

type SpecialEffectProps = {
  name: string;
  value: number;
  maxPoints: number;
};
const SpecialEffect = ({ name, value, maxPoints }: SpecialEffectProps) => {
  const tooltip =
    effectTooltips.find(tooltip => tooltip.effect === name)?.tooltip ??
    "This effect doesn't have a description yet. Try to figure out yourself what it might do.";
  return (
    <div className={s.specialEffect}>
      <div className={s.specialEffect__name}>
        <Tooltip content={tooltip}>
          <span>{name}</span>
        </Tooltip>
      </div>
      <div className={s.specialEffect__points}>
        {new Array(maxPoints).fill(0).map((_, i) => {
          const hasPoint = i + 1 <= value;
          return (
            <div
              className={modifiers(s, 'specialEffect__point', {
                isFilled: hasPoint,
              })}
            />
          );
        })}
      </div>
    </div>
  );
};

const effectTooltips = [
  {
    effect: 'retaliate',
    tooltip:
      "Every point in retaliate reflects 5% of monster's damage to you back into them",
  },
  {
    effect: 'fear',
    tooltip: "Every point in fear lowers monster's attack speed by 5%",
  },
  {
    effect: 'dodge',
    tooltip:
      "Every point in dodge gives you 5% chance of completely dodging next monster's attack",
  },
];
