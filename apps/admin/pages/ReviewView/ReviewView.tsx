import { Button, Loader, QueryBoundary } from '@mhgo/front';
import { ActionBar, HeaderEdit } from '../../containers';

import s from './ReviewView.module.scss';

export const ReviewView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const { isPending, isError, isSuccess } = {
    isPending: false,
    isError: false,
    isSuccess: false,
  };

  return (
    <div className={s.usersView}>
      <HeaderEdit
        status={{ isPending, isError, isSuccess }}
        title="NEEDS REVIEW"
        hasBackButton={false}
      />
      <ActionBar
        buttons={
          <Button label="I do nothing" onClick={() => alert('Said so :3')} />
        }
      />
      <div className={s.usersView__content}>hehe xd</div>
    </div>
  );
};
