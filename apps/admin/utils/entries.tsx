import { IconType } from '@mhgo/front';
import {
  HomeView,
  ItemsView,
  MapView,
  MaterialsView,
  MonstersView,
  SettingsView,
  UsersView,
  //
  ItemEditView,
  MaterialEditView,
  MonsterEditView,
} from '../pages';

export type Entry = {
  id: string;
  title: string;
  link: string;
  icon: IconType;
  mainRoute?: boolean;
  component: React.ReactNode;
};
export const entries: Entry[] = [
  // MAIN ROUTES
  {
    id: 'home',
    title: 'Home',
    link: '/',
    icon: 'Home',
    mainRoute: true,
    component: <HomeView />,
  },
  {
    id: 'map',
    title: 'Map',
    link: '/map',
    icon: 'Map',
    mainRoute: true,
    component: <MapView />,
  },
  {
    id: 'monsters',
    title: 'Monsters',
    link: '/monsters',
    icon: 'Monster',
    mainRoute: true,
    component: <MonstersView />,
  },
  {
    id: 'items',
    title: 'Items',
    link: '/items',
    icon: 'Armory',
    mainRoute: true,
    component: <ItemsView />,
  },
  {
    id: 'materials',
    title: 'Materials',
    link: '/materials',
    icon: 'ItemBox',
    mainRoute: true,
    component: <MaterialsView />,
  },
  {
    id: 'settings',
    title: 'Settings',
    link: '/settings',
    icon: 'Gear',
    mainRoute: true,
    component: <SettingsView />,
  },
  {
    id: 'users',
    title: 'Users',
    link: '/users',
    icon: 'Friends',
    mainRoute: true,
    component: <UsersView />,
  },
  // SUBROUTES
  {
    id: 'item_edit',
    title: 'Edit item',
    link: '/items/edit',
    icon: 'Armory',
    mainRoute: false,
    component: <ItemEditView />,
  },
  {
    id: 'material_edit',
    title: 'Edit material',
    link: '/materials/edit',
    icon: 'ItemBox',
    mainRoute: false,
    component: <MaterialEditView />,
  },
  {
    id: 'monster_edit',
    title: 'Edit monster',
    link: '/monsters/edit',
    icon: 'Monster',
    mainRoute: false,
    component: <MonsterEditView />,
  },
];
