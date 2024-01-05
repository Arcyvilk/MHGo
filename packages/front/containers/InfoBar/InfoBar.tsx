import s from './InfoBar.module.scss';

type InfoBarProps = { text: string };
export const InfoBar = ({ text }: InfoBarProps) => {
  return <div className={s.infoBar}>{text}</div>;
};
