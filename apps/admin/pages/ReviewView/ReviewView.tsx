import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  Badge,
  Button,
  Loader,
  QueryBoundary,
  useAdminApproveChanges,
  useAdminChangeReviewApi,
} from '@mhgo/front';
import { ChangeReview } from '@mhgo/types';
import { HeaderEdit } from '../../containers';
import { EntityIcon } from '../../utils/entityIcon';

import s from './ReviewView.module.scss';

dayjs.extend(relativeTime);

export const ReviewView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const {
    mutate: mutateApprove,
    isPending: isApprovePending,
    isError: isApproveError,
    isSuccess: isApproveSuccess,
  } = useAdminApproveChanges();

  const { data: changeReview } = useAdminChangeReviewApi();

  const onApproveChanges = (affectedEntityId: string) => {
    const shouldApproveChanges = confirm(
      'Are you sure that you want to approve those changes?',
    );
    if (shouldApproveChanges) mutateApprove(affectedEntityId);
  };

  return (
    <div className={s.reviewView}>
      <HeaderEdit
        status={{
          isPending: isApprovePending,
          isError: isApproveError,
          isSuccess: isApproveSuccess,
        }}
        title="NEEDS REVIEW"
        hasBackButton={false}
      />
      <div className={s.reviewView__content}>
        {changeReview.map(changes => (
          <ChangeTile
            changes={changes.documents}
            onApproveChanges={onApproveChanges}
          />
        ))}
      </div>
    </div>
  );
};

type ChangeTileProps = {
  changes: ChangeReview[];
  onApproveChanges: (affectedEntityId: string) => void;
};
const ChangeTile = ({ changes, onApproveChanges }: ChangeTileProps) => {
  const navigate = useNavigate();

  const basicInfo = changes[0];
  if (!basicInfo) return null;

  const onGoToAffectedEntity = () => {
    const link = `/${basicInfo.affectedEntityType}/edit?id=${basicInfo.affectedEntityId}`;
    navigate(link);
  };

  const entityIcon =
    basicInfo.affectedEntityType.toUpperCase() as keyof typeof EntityIcon;

  return (
    <div className={s.changeTile}>
      <div className={s.changeTile__section}>
        <span className={s.italic}>
          {dayjs(basicInfo.date).format('DD/MM/YYYY, HH:mm:ss')}
        </span>

        <div className={s.changeTile__header}>
          <Badge
            icon={EntityIcon[entityIcon]}
            label={basicInfo.affectedEntityType.toUpperCase()}
          />
          <span className={s.changeTile__title}>
            {basicInfo.affectedEntityId}
          </span>
        </div>

        <div className={s.sectionTitle}>Changes:</div>

        <div className={s.changeTile__changes}>
          {changes.map(change => (
            <SingleChange change={change} />
          ))}
        </div>
      </div>

      <div className={s.changeTile__section}>
        <div className={s.changeTile__actions}>
          <Button
            onClick={onGoToAffectedEntity}
            label="Review the affected entity"
            variant={Button.Variant.ACTION}
          />
          <Button
            onClick={() => onApproveChanges(basicInfo.affectedEntityId)}
            label="Approve all changes"
            variant={Button.Variant.DANGER}
          />
        </div>
      </div>
    </div>
  );
};

type SingleChangeProps = { change: ChangeReview };
const SingleChange = ({ change }: SingleChangeProps) => {
  const entityIcon =
    change.changedEntityType.toUpperCase() as keyof typeof EntityIcon;

  return (
    <div className={s.singleChange}>
      <div className={s.singleChange__description}>
        <Badge
          label={change.changedEntityName.toUpperCase()}
          variant={Badge.Variant.WARNING}
        />
        <Badge
          label={change.changeType.toUpperCase()}
          variant={Badge.Variant.DANGER}
        />
        <Badge
          icon={EntityIcon[entityIcon]}
          label={change.changedEntityType.toUpperCase()}
        />
      </div>

      <div className={s.sectionTitle}>
        Used as: {change.relation.toUpperCase()}
      </div>

      <div className={s.italic}>
        {dayjs(change.date).format('DD/MM/YYYY, HH:mm:ss')}
      </div>
    </div>
  );
};
