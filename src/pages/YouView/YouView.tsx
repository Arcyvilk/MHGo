import { CloseButton } from '../../components/CloseButton';
import { Buttons } from './Buttons';
import { Experience } from './Experience';
import { Hunter } from './Hunter';
import s from './YouView.module.scss';

export const YouView = () => {
  return (
    <div className={s.youView}>
      <Header />
      <Hunter />
      <Buttons />
      <CloseButton />
    </div>
  );
};

const Header = () => {
  return (
    <div className={s.header}>
      <h1 className={s.header__title}>Hunter</h1>
      <Experience />
    </div>
  );
};
