import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CDN_URL } from '@mhgo/front/env';
import { Resource } from '@mhgo/types';
import { Button, Input, useAdminCreateResourceApi } from '@mhgo/front';

import { ActionBar, HeaderEdit } from '../../../containers';
import { DEFAULT_RESOURCE } from '../../../utils/defaults';

import s from './SingleResourceView.module.scss';

export const ResourceCreateView = () => {
  const navigate = useNavigate();
  const {
    resource,
    resourceImg,
    resourceThumbnail,
    onCreate,
    setResource,
    isSuccess,
    isPending,
    isError,
  } = useUpdateResource();

  return (
    <div className={s.singleResourceView}>
      <HeaderEdit
        status={{ isSuccess, isPending, isError }}
        title="Edit resource"
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
              setValue={img => setResource({ ...resource, img })}
            />
            <img
              className={s.singleResourceView__thumbnail}
              src={`${CDN_URL}${resourceThumbnail}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const useUpdateResource = () => {
  const [resource, setResource] = useState<Resource>(DEFAULT_RESOURCE);

  const { mutate, isSuccess, isError, isPending } = useAdminCreateResourceApi();

  const resourceImg = useMemo(
    () => resource?.img.replace(CDN_URL, '') ?? '',
    [resource],
  );
  const resourceThumbnail = useMemo(
    () => resource?.thumbnail.replace(CDN_URL, '') ?? '',
    [resource],
  );

  const onCreate = () => {
    if (resource)
      mutate({
        ...resource,
        img: resourceImg,
      });
  };

  return {
    resource,
    resourceImg,
    resourceThumbnail,
    onCreate,
    setResource,
    isSuccess,
    isPending,
    isError,
  };
};
