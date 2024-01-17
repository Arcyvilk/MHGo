import { CloseButton, addCdnUrl } from '@mhgo/front';
import { EquipmentCraft } from './EquipmentCraft';
import { EquipmentLoadout } from './EquipmentLoadout';
import { EquipmentOverview } from './EquipmentOverview';

import s from './EquipmentView.module.scss';
import { Tutorial } from '../../containers';
import { useTutorialProgress } from '../../hooks/useTutorial';

export const EquipmentView = () => {
  const { isFinishedTutorialPartTwo } = useTutorialProgress();

  alert(`${window.screenX} ${window.screenY}`);

  return (
    <div
      className={s.equipmentView}
      style={{
        // TODO get this from database
        backgroundImage: `url('${addCdnUrl('/misc/avatar_nobg.png')}')`,
      }}>
      <Tutorial
        stepFrom="part5_start"
        stepTo="part5_end"
        requirement={!isFinishedTutorialPartTwo}
      />
      <div className={s.header}>
        <div className={s.header__title}>Equipment</div>
      </div>
      <EquipmentOverview />
      <div className={s.equipmentView__equipment}>
        <EquipmentLoadout />
        <EquipmentCraft />
      </div>
      <CloseButton backToHome />
    </div>
  );
};
