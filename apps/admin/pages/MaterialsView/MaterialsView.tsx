import { useMemo } from 'react';
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

import { ActionBar, Table, TableHeader } from '../../containers';
import { useAppContext } from '../../utils/context';

import s from './MaterialsView.module.scss';

const tableHeaders: TableHeader<Material>[] = [
  { id: 'name', label: 'Name' },
  { id: 'rarity', label: 'Rarity' },
  { id: 'description', label: 'Description' },
  { id: 'actions', label: 'Actions' },
];

export const MaterialsView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const {
    orderMaterial: order,
    setOrderMaterial: setOrder,
    orderByMaterial: orderBy,
    setOrderByMaterial: setOrderBy,
  } = useAppContext();
  const navigate = useNavigate();
  const { data: materials } = useMaterialsApi();

  const onMaterialEdit = (material: Material) => {
    navigate(`/materials/edit?id=${material.id}`);
  };

  const sortedMaterials = useMemo(() => {
    if (order && orderBy)
      return materials.sort((a, b) =>
        order === 'asc'
          ? (a[orderBy] ?? 0) > (b[orderBy] ?? 0)
            ? 1
            : -1
          : (a[orderBy] ?? 0) < (b[orderBy] ?? 0)
            ? 1
            : -1,
      );
    else return materials;
  }, [materials, order, orderBy]);

  const tableRows = sortedMaterials.map(material => [
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
        <Table
          tableHeaders={tableHeaders}
          items={tableRows}
          order={order}
          setOrder={setOrder}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
        />
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
