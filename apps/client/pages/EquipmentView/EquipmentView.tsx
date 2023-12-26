import { CloseButton } from '../../components';
import { EquipmentCraft } from './EquipmentCraft';
import { EquipmentLoadout } from './EquipmentLoadout';
import { EquipmentOverview } from './EquipmentOverview';
import s from './EquipmentView.module.scss';

// TODO This page has completely fucked up z-margins and positions
// fix this
export const EquipmentView = () => {
  return (
    <div className={s.equipmentView}>
      <div className={s.header}>
        <div className={s.header__title}>Equipment</div>
      </div>
      <EquipmentOverview />
      <div className={s.equipmentView__equipment}>
        <EquipmentLoadout />
        <EquipmentCraft />
      </div>
      <CloseButton />
    </div>
  );
};
