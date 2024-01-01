import s from './UsersView.module.scss';

export const UsersView = () => {
  return (
    <div className={s.usersView}>
      <div className={s.usersView__header}>
        <h1 className={s.usersView__title}>USERS</h1>
      </div>
      <div className={s.usersView__content}>gfrew2</div>
    </div>
  );
};
