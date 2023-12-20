import { CloseButton } from '../../components/CloseButton';
import { Buttons } from './Buttons';
import { Experience } from './Experience';
import { Hunter } from './Hunter';

import s from './YouView.module.scss';

import { USER_ID } from '../../_mock/settings';

export const YouView = () => {
  const userId = USER_ID;
  return (
    <div className={s.youView}>
      <Header userId={userId} />
      <div className={s.youView__wrapper}>
        <Hunter />
        <Buttons />
      </div>
      <CloseButton />
    </div>
  );
};

type HeaderProps = { userId: string };
const Header = ({ userId }: HeaderProps) => {
  return (
    <div className={s.header}>
      <h1 className={s.header__title}>Hunter</h1>
      <Experience userId={userId} />
    </div>
  );
};
