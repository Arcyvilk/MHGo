import { useNavigate } from 'react-router-dom';
import {
  Button,
  Icon,
  Loader,
  QueryBoundary,
  Size,
  useResourcesApi,
} from '@mhgo/front';
import { Resource } from '@mhgo/types';

import { ActionBar, Table } from '../../containers';

import s from './ResourcesView.module.scss';

const tableHeaders = ['Name', 'Description', 'Level requirement', 'Actions'];

export const ResourcesView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const navigate = useNavigate();
  const { data: resources } = useResourcesApi();

  const onResourceEdit = (resource: Resource) => {
    navigate(`/resources/edit?id=${resource.id}`);
  };

  const tableRows = resources.map(resource => [
    <ResourceCell resource={resource} />,
    resource.description,
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
        <Table tableHeaders={tableHeaders} items={tableRows} />
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
