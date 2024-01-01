import { IconType } from '@mhgo/front';
import {
  HomeView,
  ItemsView,
  MapView,
  MaterialsView,
  MonstersView,
  SettingsView,
  UsersView,
} from '../pages';

export type Entry = {
  id: string;
  title: string;
  link: string;
  icon: IconType;
  component: React.ReactNode;
};
export const entries: Entry[] = [
  {
    id: 'home',
    title: 'home',
    link: '/',
    icon: 'Monster',
    component: <HomeView />,
  },
  {
    id: 'dupa',
    title: 'dupa',
    link: '/dupa',
    icon: 'Monster',
    component: <MapView />,
  },
  {
    id: 'buttocks',
    title: 'buttocks',
    link: '/buttocks',
    icon: 'Monster',
    component: <MonstersView />,
  },
  {
    id: 'raeva',
    title: 'raeva',
    link: '/raeva',
    icon: 'Monster',
    component: <ItemsView />,
  },
  {
    id: 'ass',
    title: 'ass',
    link: '/ass',
    icon: 'Monster',
    component: <MaterialsView />,
  },
  {
    id: 'arsch',
    title: 'arsch',
    link: '/arsch',
    icon: 'Monster',
    component: <SettingsView />,
  },
  {
    id: 'perse',
    title: 'perse',
    link: '/perse',
    icon: 'Monster',
    component: <UsersView />,
  },
];
