import s from './HomeView.module.scss';

export const HomeView = () => {
  return (
    <div className={s.homeView}>
      <div className={s.homeView__header}>
        <h1 className={s.homeView__title}>HOME</h1>
      </div>
      <div className={s.homeView__content}>
        <p>
          <ul>
            <li>
              <a href="https://fanonmonsterhunter.fandom.com/wiki/Other_Icons">
                website with good quality Monster Hunter icons
              </a>
            </li>
            <li>
              <a href="https://dreamstudio.ai/generate">
                AI I used to generate monsters/habitats
              </a>
            </li>
            <li>
              <a href="https://www.remove.bg">
                good website to remove backgrounds from generated images
              </a>
            </li>
          </ul>
        </p>
      </div>
    </div>
  );
};
