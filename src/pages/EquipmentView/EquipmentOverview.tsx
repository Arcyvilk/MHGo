import { Icon } from '../../components';
import { Size } from '../../utils/size';
import s from './EquipmentOverview.module.scss';

export const EquipmentOverview = () => {
  return (
    <div className={s.equipmentView__overview}>
      <div className={s.equipmentView__avatar} />
      <div className={s.equipmentView__stats}>
        <div className={s.stats}>
          <span>
            <Icon icon="Sword" size={Size.MICRO} />
            Attack
          </span>
          <span>100</span>
        </div>
        <div className={s.stats}>
          <span>
            <Icon icon="Fire" size={Size.MICRO} />
            Element
          </span>
          <span>none</span>
        </div>
        <div className={s.stats}>
          <span>
            <Icon icon="Shield" size={Size.MICRO} />
            Defense
          </span>
          <span>100</span>
        </div>
        <div className={s.stats}>
          <span>
            <Icon icon="Pulse" size={Size.MICRO} />
            HP
          </span>
          <span>100</span>
        </div>
        <div className={s.stats}>
          <span>
            <Icon icon="Burst" size={Size.MICRO} />
            Critical hit
          </span>
          <span>0</span>
        </div>
      </div>
    </div>
  );
};
