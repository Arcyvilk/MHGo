import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import {
  Button,
  Loader,
  QueryBoundary,
  useAdminChangeReviewApi,
} from '@mhgo/front';
import { ChangeReview } from '@mhgo/types';
import { ActionBar, HeaderEdit } from '../../containers';

import s from './ReviewView.module.scss';
import { useNavigate } from 'react-router-dom';

dayjs.extend(relativeTime);

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
  const { data: changeReview } = useAdminChangeReviewApi();

  return (
    <div className={s.reviewView}>
      <HeaderEdit
        status={{ isPending, isError, isSuccess }}
        title="NEEDS REVIEW"
        hasBackButton={false}
      />
      <div className={s.reviewView__content}>
        {changeReview.map(changes => (
          <ChangeTile changes={changes.documents} />
        ))}
      </div>
    </div>
  );
};

type ChangeTileProps = { changes: ChangeReview[] };
const ChangeTile = ({ changes }: ChangeTileProps) => {
  const navigate = useNavigate();

  const basicInfo = changes[0];
  if (!basicInfo) return null;

  const onGoToAffectedEntity = () => {
    const link = `/${basicInfo.affectedEntityType}/edit?id=${basicInfo.affectedEntityId}`;
    navigate(link);
  };

  return (
    <div className={s.changeTile}>
      <div className={s.changeTile__header}>
        <span className={s.sectionTitle}>{basicInfo.affectedEntityType}:</span>
        <Button
          onClick={onGoToAffectedEntity}
          label={<span className={s.italic}>{basicInfo.affectedEntityId}</span>}
          small
        />
      </div>

      <div>
        <span className={s.sectionTitle}>Last change: </span>
        <span className={s.italic}>
          {dayjs(basicInfo.date).format('DD/MM/YYYY, HH:mm:ss')}
        </span>
      </div>

      <div className={s.sectionTitle}>Changes:</div>

      <div>
        {changes.map(change => (
          <SingleChange change={change} />
        ))}
      </div>
    </div>
  );
};

type SingleChangeProps = { change: ChangeReview };
const SingleChange = ({ change }: SingleChangeProps) => {
  return (
    <div className={s.singleChange}>
      <div>{dayjs(change.date).format('DD/MM/YYYY, HH:mm:ss')}</div>
      <div>
        {change.changedEntityType.toUpperCase()} "
        {change.changedEntityName.toUpperCase()}" was{' '}
        {change.changeType.toUpperCase()}
      </div>
      <div>Used as: {change.relation.toUpperCase()}</div>
    </div>
  );
};
