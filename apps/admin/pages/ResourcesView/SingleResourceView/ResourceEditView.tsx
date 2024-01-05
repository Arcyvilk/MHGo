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
import { ResourceDrops } from '.';
import { Resource } from '@mhgo/types';
import { Status } from '../../../utils/types';

export const ResourceEditView = () => {
  const navigate = useNavigate();
  const [updatedDrops, setUpdatedDrops] = useState<Resource['drops']>([]);
  const [status, setStatus] = useState({
    isSuccess: false,
    isError: false,
    isPending: false,
  });
  const {
    updatedResource,
    setUpdatedResource,
    resourceImg,
    resourceThumbnail,
    onSave,
  } = useUpdateResource(updatedDrops, setStatus);

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
      <HeaderEdit status={status} title="Edit resource" />
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
                updatedResource &&
                setUpdatedResource({ ...updatedResource, name })
              }
            />
            <Input
              name="resource_desc"
              label="Resource's description"
              value={updatedResource?.description ?? ''}
              setValue={description =>
                updatedResource &&
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
              setValue={img =>
                updatedResource &&
                setUpdatedResource({ ...updatedResource, img })
              }
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
                updatedResource &&
                setUpdatedResource({ ...updatedResource, thumbnail })
              }
            />
            <img
              className={s.singleResourceView__thumbnail}
              src={`${CDN_URL}${resourceThumbnail}`}
            />
          </div>
          <div className={s.singleMonsterView__content}>
            <div className={s.singleResourceView__section}>
              <ResourceDrops
                updatedDrops={updatedDrops}
                setUpdatedDrops={setUpdatedDrops}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const useUpdateResource = (
  updatedDrops: Resource['drops'],
  setStatus: (status: Status) => void,
) => {
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

  const { mutateResource } = useStatus(setStatus);

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
      mutateResource({
        ...updatedResource,
        img: resourceImg,
        thumbnail: resourceThumbnail,
        drops: updatedDrops,
      });
  };

  return {
    updatedResource,
    setUpdatedResource,
    resourceImg,
    resourceThumbnail,
    onSave,
  };
};

const useStatus = (setStatus: (status: Status) => void) => {
  const {
    mutate: mutateResource,
    isSuccess: isSuccessMonster,
    isError: isErrorMonster,
    isPending: isPendingMonster,
  } = useAdminUpdateResourceApi();

  useEffect(() => {
    setStatus({
      isSuccess: isSuccessMonster,
      isError: isErrorMonster,
      isPending: isPendingMonster,
    });
  }, [isSuccessMonster, isErrorMonster, isPendingMonster]);

  return { mutateResource };
};
