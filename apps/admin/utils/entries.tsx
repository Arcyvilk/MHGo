import { IconType } from '@mhgo/front';
import { EntityIcon } from './entityIcon';
import {
  HabitatsView,
  HomeView,
  ItemsView,
  MapView,
  MaterialsView,
  MonstersView,
  ResourcesView,
  ReviewView,
  SettingsView,
  UsersView,
  //
  HabitatCreateView,
  HabitatEditView,
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
  QuestsView,
  QuestCreateView,
  QuestEditView,
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
    id: 'items',
    title: 'Items',
    link: '/items',
    icon: EntityIcon.ITEMS,
    mainRoute: true,
    component: <ItemsView />,
  },
  {
    id: 'materials',
    title: 'Materials',
    link: '/materials',
    icon: EntityIcon.MATERIALS,
    mainRoute: true,
    component: <MaterialsView />,
  },
  {
    id: 'habitats',
    title: 'Habitats',
    link: '/habitats',
    icon: EntityIcon.HABITATS,
    mainRoute: true,
    component: <HabitatsView />,
  },
  {
    id: 'monsters',
    title: 'Monsters',
    link: '/monsters',
    icon: EntityIcon.MONSTERS,
    mainRoute: true,
    component: <MonstersView />,
  },
  {
    id: 'resources',
    title: 'Resources',
    link: '/resources',
    icon: EntityIcon.RESOURCES,
    mainRoute: true,
    component: <ResourcesView />,
  },
  {
    id: 'quests',
    title: 'Quests',
    link: '/quests',
    icon: EntityIcon.QUESTS,
    mainRoute: true,
    component: <QuestsView />,
  },
  {
    id: 'users',
    title: 'Users',
    link: '/users',
    icon: EntityIcon.USERS,
    mainRoute: true,
    component: <UsersView />,
  },
  {
    id: 'review',
    title: 'Review',
    link: '/review',
    icon: 'Warning',
    mainRoute: true,
    component: <ReviewView />,
  },
  {
    id: 'settings',
    title: 'Settings',
    link: '/settings',
    icon: 'Gear',
    mainRoute: true,
    component: <SettingsView />,
  },

  // SUBROUTES
  {
    id: 'habitat_create',
    title: 'Create habitat',
    link: '/habitats/create',
    icon: 'Tree',
    mainRoute: false,
    component: <HabitatCreateView />,
  },
  {
    id: 'habitat_edit',
    title: 'Edit habitat',
    link: '/habitats/edit',
    icon: 'Tree',
    mainRoute: false,
    component: <HabitatEditView />,
  },
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
    id: 'quest_edit',
    title: 'Edit quest',
    link: '/quests/edit',
    icon: 'Quest',
    mainRoute: false,
    component: <QuestEditView />,
  },
  {
    id: 'quest_create',
    title: 'Create quest',
    link: '/quests/create',
    icon: 'Quest',
    mainRoute: false,
    component: <QuestCreateView />,
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
