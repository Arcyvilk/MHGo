import s from './AuthView.module.scss';

export const SignInView = () => {
  return (
    <div className={s.authView}>
      <div className={s.authView__wrapper}>
        <img
          className={s.authView__logo}
          src="https://cdn.arcyvilk.com/mhgo/misc/logo.png"
          alt="logo"
        />
        <div className={s.authView__title}>Sign in</div>
        <div className={s.authView__desc}>Sign in pls</div>
      </div>
    </div>
  );
};
