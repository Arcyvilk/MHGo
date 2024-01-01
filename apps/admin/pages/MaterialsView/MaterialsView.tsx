import { useMaterialsApi } from '@mhgo/front';
import s from './MaterialsView.module.scss';

export const MaterialsView = () => {
  const { data: materials } = useMaterialsApi();
  return (
    <div className={s.materialsView}>
      <h1 className={s.materialsView__title}>MATERIALS</h1>
    </div>
  );
};
