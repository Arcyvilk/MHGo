import { useMaterialsApi } from '@mhgo/front';
import s from './MaterialsView.module.scss';
import { Material } from '@mhgo/types';
import { Table } from '../../containers';

export const MaterialsView = () => {
  const { data: materials } = useMaterialsApi();

  const tableHeaders = ['Name', 'Rarity', 'Description'];

  const tableRows = materials.map(material => [
    <MaterialCell material={material} />,
    material.rarity,
    material.description,
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
