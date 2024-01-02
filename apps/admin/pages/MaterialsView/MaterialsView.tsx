import { useNavigate } from 'react-router-dom';
import { Button, Icon, Size, useMaterialsApi } from '@mhgo/front';
import { Material } from '@mhgo/types';

import { Table } from '../../containers';

import s from './MaterialsView.module.scss';

const tableHeaders = ['Name', 'Rarity', 'Description', 'Actions'];

export const MaterialsView = () => {
  const navigate = useNavigate();
  const { data: materials } = useMaterialsApi();

  const onMaterialEdit = (material: Material) => {
    navigate(`/materials/edit?id=${material.id}`);
  };

  const tableRows = materials.map(material => [
    <MaterialCell material={material} />,
    material.rarity,
    material.description,
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
      <Table tableHeaders={tableHeaders} items={tableRows} />
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
