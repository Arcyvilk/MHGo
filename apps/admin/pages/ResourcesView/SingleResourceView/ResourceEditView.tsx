import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CDN_URL } from '@mhgo/front/env';
import {
  Button,
  Input,
  useAdminUpdateResourceApi,
  useResourcesApi,
} from '@mhgo/front';
import { ActionBar, HeaderEdit } from '../../../containers';

import s from './SingleResourceView.module.scss';

export const ResourceEditView = () => {
  const navigate = useNavigate();
  const {
    updatedResource,
    setUpdatedResource,
    resourceImg,
    resourceThumbnail,
    onSave,
    isSuccess,
    isPending,
    isError,
  } = useUpdateResource();

  if (!updatedResource)
    return (
      <div className={s.singleResourceView}>
        <div className={s.singleResourceView__header}>
          <h1 className={s.singleResourceView__title}>
            This resource does not exist
          </h1>
        </div>
        <div className={s.singleResourceView__footer}>
          <Button label="Back" onClick={() => navigate(-1)} />
        </div>
      </div>
    );

  return (
    <div className={s.singleResourceView}>
      <HeaderEdit
        status={{ isSuccess, isPending, isError }}
        title="Edit resource"
      />
      <ActionBar
        title={`Resource ID: ${updatedResource?.id}`}
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
              label="Save"
              onClick={onSave}
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
              value={updatedResource?.name ?? ''}
              setValue={name =>
                setUpdatedResource({ ...updatedResource, name })
              }
            />
            <Input
              name="resource_desc"
              label="Resource's description"
              value={updatedResource?.description ?? ''}
              setValue={description =>
                setUpdatedResource({ ...updatedResource, description })
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
              setValue={img => setUpdatedResource({ ...updatedResource, img })}
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
              setValue={thumbnail =>
                setUpdatedResource({ ...updatedResource, thumbnail })
              }
            />
            <img
              className={s.singleResourceView__thumbnail}
              src={`${CDN_URL}${resourceThumbnail}`}
            />
          </div>
          <div className={s.singleResourceView__section}>
            <div className={s.singleResourceView__infoSection}>
              <p
                style={{ fontWeight: 600 }}
                className={s.singleResourceView__withInfo}>
                Drops:
              </p>
              {updatedResource.drops.length > 0
                ? updatedResource.drops.map(drop => (
                    <Button
                      variant={Button.Variant.GHOST}
                      simple
                      inverted
                      label={drop.materialId}
                      onClick={() =>
                        navigate(`/materials/edit?id=${drop.materialId}`)
                      }
                    />
                  ))
                : '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const useUpdateResource = () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  const { data: resources, isFetched: isResourcesFetched } = useResourcesApi();

  const resource = useMemo(
    () => resources.find(i => i.id === id),
    [resources, isResourcesFetched],
  );
  const [updatedResource, setUpdatedResource] = useState(resource);

  useEffect(() => {
    setUpdatedResource(resource);
  }, [isResourcesFetched]);

  const { mutate, isSuccess, isError, isPending } = useAdminUpdateResourceApi();

  const resourceImg = useMemo(
    () => updatedResource?.img.replace(CDN_URL, '') ?? '',
    [resources],
  );
  const resourceThumbnail = useMemo(
    () => updatedResource?.thumbnail.replace(CDN_URL, '') ?? '',
    [resources],
  );

  const onSave = () => {
    if (updatedResource)
      mutate({
        ...updatedResource,
        img: resourceImg,
      });
  };

  return {
    updatedResource,
    setUpdatedResource,
    resourceImg,
    resourceThumbnail,
    onSave,
    isSuccess,
    isPending,
    isError,
  };
};
