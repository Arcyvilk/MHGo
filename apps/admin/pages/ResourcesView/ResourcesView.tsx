import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Switch } from '@mui/material';
import {
  Button,
  Icon,
  Loader,
  QueryBoundary,
  Size,
  useAdminUpdateResourceApi,
  useResourcesApi,
} from '@mhgo/front';
import { Resource } from '@mhgo/types';

import { ActionBar, Table, TableHeader } from '../../containers';
import { useAppContext } from '../../utils/context';

import s from './ResourcesView.module.scss';

const tableHeaders: TableHeader<Resource>[] = [
  { id: 'disabled', label: '' },
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
  { id: 'levelRequirements', label: 'LVL req.' },
  { id: 'actions', label: 'Actions' },
];

export const ResourcesView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const {
    orderResource: order,
    setOrderResource: setOrder,
    orderByResource: orderBy,
    setOrderByResource: setOrderBy,
  } = useAppContext();
  const navigate = useNavigate();
  const { data: resources } = useResourcesApi();
  const { mutate, isSuccess, isError } = useAdminUpdateResourceApi();

  const onResourceEdit = (resource: Resource) => {
    navigate(`/resources/edit?id=${resource.id}`);
  };

  const onSwitch = (
    checked: boolean,
    resource: Resource,
    property: keyof Resource,
  ) => {
    const updatedResource = {
      ...resource,
      [property]: checked,
    };
    mutate(updatedResource);
  };

  // TODO Make those two into a hook
  // and don't display a toast, show "Saving..." and "Saved!" in the header instead
  useEffect(() => {
    if (isSuccess) toast.success('Item saved successfully!');
  }, [isSuccess]);

  useEffect(() => {
    if (isError) toast.error('Could not save the item :c');
  }, [isError]);

  const sortedResources = useMemo(() => {
    if (order && orderBy)
      return resources.sort((a, b) =>
        order === 'asc'
          ? (a[orderBy] ?? 0) > (b[orderBy] ?? 0)
            ? 1
            : -1
          : (a[orderBy] ?? 0) < (b[orderBy] ?? 0)
            ? 1
            : -1,
      );
    else return resources;
  }, [resources, order, orderBy]);

  const tableRows = sortedResources.map(resource => [
    <Switch
      color="default"
      checked={!resource.disabled}
      onChange={(_, checked) => onSwitch(!checked, resource, 'disabled')}
    />,
    <ResourceCell resource={resource} />,
    <Table.CustomCell content={resource.description} />,
    resource.levelRequirements,
    <Button
      label={<Icon icon="Edit" size={Size.MICRO} />}
      onClick={() => onResourceEdit(resource)}
      style={{ width: '40px' }}
    />,
  ]);
  return (
    <div className={s.resourcesView}>
      <div className={s.resourcesView__header}>
        <h1 className={s.resourcesView__title}>RESOURCES</h1>
      </div>
      <ActionBar
        buttons={
          <>
            <Button
              label="Create new resource"
              onClick={() => navigate('create')}
            />
          </>
        }
      />
      <div className={s.resourcesView__content}>
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

const ResourceCell = ({ resource }: { resource: Resource }) => {
  return (
    <div className={s.resourcesView__itemDetail}>
      <img src={resource.img} className={s.resourcesView__itemIcon} />
      {resource.name}
    </div>
  );
};
