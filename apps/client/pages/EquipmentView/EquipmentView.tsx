import { CloseButton, Flash } from '@mhgo/front';
import { addCdnUrl } from '../../utils/addCdnUrl';
import { EquipmentCraft } from './EquipmentCraft';
import { EquipmentLoadout } from './EquipmentLoadout';
import { EquipmentOverview } from './EquipmentOverview';

import s from './EquipmentView.module.scss';

export const EquipmentView = () => {
  return (
    <div
      className={s.equipmentView}
      style={{
        // TODO get this from database
        backgroundImage: `url('${addCdnUrl('/misc/avatar_nobg.png')}')`,
      }}>
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
