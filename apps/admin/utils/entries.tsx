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
    title: 'Home',
    link: '/',
    icon: 'Paw',
    component: <HomeView />,
  },
  {
    id: 'map',
    title: 'Map',
    link: '/map',
    icon: 'Marker',
    component: <MapView />,
  },
  {
    id: 'monsters',
    title: 'Monsters',
    link: '/monsters',
    icon: 'Monster',
    component: <MonstersView />,
  },
  {
    id: 'items',
    title: 'Items',
    link: '/items',
    icon: 'Armory',
    component: <ItemsView />,
  },
  {
    id: 'materials',
    title: 'Materials',
    link: '/materials',
    icon: 'ItemBox',
    component: <MaterialsView />,
  },
  {
    id: 'settings',
    title: 'Settings',
    link: '/settings',
    icon: 'Gear',
    component: <SettingsView />,
  },
  {
    id: 'users',
    title: 'Users',
    link: '/users',
    icon: 'Friends',
    component: <UsersView />,
  },
];
