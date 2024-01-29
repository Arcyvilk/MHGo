import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, Loader, QueryBoundary, Size, modifiers } from '@mhgo/front';

import { Entry, entries } from '../../utils/entries';

import s from './Sidebar.module.scss';
import { useMe } from '../../utils/useMe';

type SidebarProps = { title?: React.ReactNode };
export const Sidebar = (props: SidebarProps) => (
  <QueryBoundary fallback={<Loader />}>
    <Load {...props} />
  </QueryBoundary>
);

const Load = ({ title }: SidebarProps) => {
  const { isLoggedIn, isAdmin, logoutUser } = useMe();
  const navigate = useNavigate();
  const onEntryClick = (entry: Entry) => {
    if (!isLoggedIn || !isAdmin) return;
    navigate(entry.link);
  };

  const onSwitchAdventure = () => {
    navigate('/auth/adventure');
  };

  if (isLoggedIn === false || isAdmin === false) return null;
  return (
    <div className={s.sidebar}>
      <div className={s.sidebar__top}>
        {title && <h2>{title}</h2>}
        {entries
          .filter(entry => entry.mainRoute)
          .map(entry => (
            <button
              key={entry.id}
              className={s.sidebar__entry}
              onClick={() => onEntryClick(entry)}>
              {!isLoggedIn || !isAdmin ? (
                <Icon icon="Spin" spin size={Size.MICRO} />
              ) : (
                <>
                  <Icon icon={entry.icon} size={Size.MICRO} />
                  {entry.title}
                </>
              )}
            </button>
          ))}
      </div>

      <div className={s.sidebar__bottom}>
        <button
          key="switch_adventure"
          className={s.sidebar__entry}
          onClick={onSwitchAdventure}>
          <Icon icon="Logout" size={Size.MICRO} />
          Switch adventure
        </button>
        <button key="logout" className={s.sidebar__entry} onClick={logoutUser}>
          <Icon icon="Logout" size={Size.MICRO} />
          Logout
        </button>
      </div>
    </div>
  );
};
