import { IconType } from '@mhgo/front';
import {
  HomeView,
  ItemsView,
  MapView,
  MaterialsView,
  MonstersView,
  ResourcesView,
  SettingsView,
  UsersView,
  //
  ItemCreateView,
  ItemEditView,
  MaterialCreateView,
  MaterialEditView,
  MonsterEditView,
  MonsterCreateView,
  ResourceCreateView,
  ResourceEditView,
  UserCreateView,
  UserEditView,
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
    id: 'resources',
    title: 'Resources',
    link: '/resources',
    icon: 'Star',
    mainRoute: true,
    component: <ResourcesView />,
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
    id: 'item_create',
    title: 'Create item',
    link: '/items/create',
    icon: 'Armory',
    mainRoute: false,
    component: <ItemCreateView />,
  },
  {
    id: 'item_edit',
    title: 'Edit item',
    link: '/items/edit',
    icon: 'Armory',
    mainRoute: false,
    component: <ItemEditView />,
  },
  {
    id: 'material_create',
    title: 'Create material',
    link: '/materials/create',
    icon: 'ItemBox',
    mainRoute: false,
    component: <MaterialCreateView />,
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
    id: 'monster_create',
    title: 'Create monster',
    link: '/monsters/create',
    icon: 'Monster',
    mainRoute: false,
    component: <MonsterCreateView />,
  },
  {
    id: 'monster_edit',
    title: 'Edit monster',
    link: '/monsters/edit',
    icon: 'Monster',
    mainRoute: false,
    component: <MonsterEditView />,
  },
  {
    id: 'resource_create',
    title: 'Create resource',
    link: '/resources/create',
    icon: 'Star',
    mainRoute: false,
    component: <ResourceCreateView />,
  },
  {
    id: 'resource_edit',
    title: 'Edit resource',
    link: '/resources/edit',
    icon: 'Star',
    mainRoute: false,
    component: <ResourceEditView />,
  },
  {
    id: 'user_create',
    title: 'Create user',
    link: '/users/create',
    icon: 'Friends',
    mainRoute: false,
    component: <UserCreateView />,
  },
  {
    id: 'user_edit',
    title: 'Edit user',
    link: '/users/edit',
    icon: 'Friends',
    mainRoute: false,
    component: <UserEditView />,
  },
];
