import { useNavigate } from 'react-router-dom';
import {
  Button,
  Icon,
  Loader,
  QueryBoundary,
  Size,
  useMaterialsApi,
} from '@mhgo/front';
import { Material } from '@mhgo/types';

import { ActionBar, Table } from '../../containers';

import s from './MaterialsView.module.scss';

const tableHeaders = ['Name', 'Rarity', 'Description', 'Actions'];

export const MaterialsView = () => (
  <QueryBoundary fallback={<Loader fullScreen />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const navigate = useNavigate();
  const { data: materials } = useMaterialsApi();

  const onMaterialEdit = (material: Material) => {
    navigate(`/materials/edit?id=${material.id}`);
  };

  const tableRows = materials.map(material => [
    <MaterialCell material={material} />,
    material.rarity,
    <Table.CustomCell content={material.description} />,
    <Button
      label={<Icon icon="Edit" size={Size.MICRO} />}
      onClick={() => onMaterialEdit(material)}
      style={{ width: '40px' }}
    />,
  ]);
  return (
    <div className={s.materialsView}>
      <div className={s.materialsView__header}>
        <h1 className={s.materialsView__title}>MATERIALS</h1>
      </div>
      <ActionBar
        buttons={
          <>
            <Button
              label="Create new material"
              onClick={() => navigate('create')}
            />
          </>
        }
      />
      <div className={s.materialsView__content}>
        <Table tableHeaders={tableHeaders} items={tableRows} />
      </div>
    </div>
  );
};

const MaterialCell = ({ material }: { material: Material }) => {
  return (
    <div className={s.materialsView__itemDetail}>
      <img
        src={material.img}
        className={s.materialsView__itemIcon}
        style={{ filter: material.filter }}
      />
      {material.name}
    </div>
  );
};
