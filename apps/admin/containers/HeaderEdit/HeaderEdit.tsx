import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Icon, Size, modifiers } from '@mhgo/front';
import { Status } from '../../utils/types';

import s from './HeaderEdit.module.scss';

type HeaderEditProps = {
  title: string;
  status: Status;
};
export const HeaderEdit = ({ title, status }: HeaderEditProps) => {
  const navigate = useNavigate();
  const [saveStatus, setSaveStatus] = useState(status);

  useEffect(() => {
    if (JSON.stringify(status) === JSON.stringify(saveStatus)) return;
    setSaveStatus(status);
    setTimeout(() => {
      // Reset save status so "Saved!" notif isn't displayed indefinitely
      setSaveStatus({
        isError: false,
        isPending: false,
        isSuccess: false,
      });
    }, 2500);
  }, [status]);

  return (
    <div className={s.headerEdit__header}>
      <h1 className={s.headerEdit__title}>
        <Button
          label={<Icon icon="Back" size={Size.MICRO} />}
          onClick={() => navigate(-1)}
          style={{ width: '48px' }}
          inverted
          variant={Button.Variant.GHOST}
        />
        {title}
      </h1>
      <div
        className={modifiers(s, 'headerEdit__status', {
          isPending: saveStatus.isPending,
          isSuccess: saveStatus.isSuccess,
          isError: saveStatus.isError,
        })}>
        {saveStatus.isPending && <Icon icon="Spin" spin />}
        {saveStatus.isSuccess && 'Saved!'}
        {saveStatus.isError && 'Could not save!'}
      </div>
    </div>
  );
};
