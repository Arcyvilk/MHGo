import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CDN_URL } from '@mhgo/front/env';
import { Resource, ResourceDrop } from '@mhgo/types';
import {
  Button,
  Input,
  removeCdnUrl,
  useAdminCreateResourceApi,
} from '@mhgo/front';

import { ActionBar, HeaderEdit } from '../../../containers';
import { DEFAULT_RESOURCE } from '../../../utils/defaults';

import s from './SingleResourceView.module.scss';
import { ResourceDrops } from '.';
import { Status } from '../../../utils/types';
import useEnhancedEffect from '@mui/material/utils/useEnhancedEffect';

export const ResourceCreateView = () => {
  const navigate = useNavigate();
  const [updatedDrops, setUpdatedDrops] = useState<ResourceDrop['drops']>([]);
  const [status, setStatus] = useState({
    isSuccess: false,
    isError: false,
    isPending: false,
  });
  const { resource, resourceImg, resourceThumbnail, setResource, onCreate } =
    useUpdateResource(updatedDrops, setStatus);

  return (
    <div className={s.singleResourceView}>
      <HeaderEdit
        status={status}
        title="Create resource"
        hasBackButton={true}
      />
      <ActionBar
        buttons={
          <>
            <Button
              label="Cancel"
              inverted
              simple
              onClick={() => navigate(-1)}
              variant={Button.Variant.GHOST}
            />
            <Button
              label="Create"
              onClick={onCreate}
              variant={Button.Variant.ACTION}
            />
          </>
        }
      />
      <div className={s.singleResourceView__content}>
        <div className={s.singleResourceView__content}>
          <div className={s.singleResourceView__section}>
            <Input
              name="resource_name"
              label="Resource's name"
              value={resource?.name ?? ''}
              setValue={name => setResource({ ...resource, name })}
            />
            <Input
              name="resource_desc"
              label="Resource's description"
              value={resource?.description ?? ''}
              setValue={description =>
                setResource({ ...resource, description })
              }
            />
            <Input
              name="resource_req"
              label="Resource spawn level requirement"
              type="number"
              min={0}
              value={String(resource?.levelRequirements ?? 0)}
              setValue={levelRequirements =>
                setResource({
                  ...resource,
                  levelRequirements: Number(levelRequirements),
                })
              }
            />
          </div>
          <div
            className={s.singleResourceView__section}
            style={{ alignItems: 'center' }}>
            <Input
              name="resource_img"
              label="Path to resource image"
              value={resourceImg}
              setValue={img => setResource({ ...resource, img })}
            />
            <img
              className={s.singleResourceView__img}
              src={`${CDN_URL}${resourceImg}`}
            />
          </div>
          <div
            className={s.singleResourceView__section}
            style={{ alignItems: 'center' }}>
            <Input
              name="resource_thumbnail"
              label="Path to resource thumbnail"
              value={resourceThumbnail}
              setValue={thumbnail => setResource({ ...resource, thumbnail })}
            />
            <img
              className={s.singleResourceView__thumbnail}
              src={`${CDN_URL}${resourceThumbnail}`}
            />
          </div>
        </div>
        <div className={s.singleResourceView__section}>
          <ResourceDrops
            updatedDrops={updatedDrops}
            setUpdatedDrops={setUpdatedDrops}
          />
        </div>
      </div>
    </div>
  );
};

const useUpdateResource = (
  drops: ResourceDrop['drops'],
  setStatus: (status: Status) => void,
) => {
  const [resource, setResource] = useState<Resource>(DEFAULT_RESOURCE);
  const { mutateResource } = useStatus(setStatus);

  const resourceImg = useMemo(() => removeCdnUrl(resource?.img), [resource]);
  const resourceThumbnail = useMemo(
    () => removeCdnUrl(resource?.thumbnail),
    [resource],
  );

  const onCreate = () => {
    if (resource) {
      const resourceId = resource.name.toLowerCase().replace(/ /g, '_');
      mutateResource({
        resource: {
          ...resource,
          img: resourceImg,
          thumbnail: resourceThumbnail,
          levelRequirements: resource.levelRequirements ?? null,
        },
        drops: { resourceId, drops },
      });
    }
  };

  return {
    resource,
    setResource,
    resourceImg,
    resourceThumbnail,
    onCreate,
  };
};

const useStatus = (setStatus: (status: Status) => void) => {
  const {
    mutate: mutateResource,
    isSuccess,
    isError,
    isPending,
  } = useAdminCreateResourceApi();

  useEnhancedEffect(() => {
    setStatus({ isSuccess, isError, isPending });
  }, [isSuccess, isError, isPending]);

  return { mutateResource };
};
