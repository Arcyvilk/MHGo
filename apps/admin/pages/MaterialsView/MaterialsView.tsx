import { useMaterialsApi } from '@mhgo/front';
import s from './MaterialsView.module.scss';

export const MaterialsView = () => {
  const { data: materials } = useMaterialsApi();
  return (
    <div className={s.materialsView}>
      <div className={s.materialsView__header}>
        <h1 className={s.materialsView__title}>MATERIALS</h1>
      </div>
      <div className={s.materialsView__content}></div>
    </div>
  );
};
