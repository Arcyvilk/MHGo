import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, Size } from '@mhgo/front';

import { Entry, entries } from '../../utils/entries';

import s from './Sidebar.module.scss';

type Props = { title?: React.ReactNode };
export const Sidebar = ({ title }: Props) => {
  const navigate = useNavigate();
  const onEntryClick = (entry: Entry) => navigate(entry.link);

  return (
    <div className={s.sidebar}>
      {title && <h2>{title}</h2>}
      {entries
        .filter(entry => entry.mainRoute)
        .map(entry => (
          <button
            key={entry.id}
            className={s.sidebar__entry}
            onClick={() => onEntryClick(entry)}>
            <Icon icon={entry.icon} size={Size.MICRO} />
            {entry.title}
          </button>
        ))}
    </div>
  );
};
