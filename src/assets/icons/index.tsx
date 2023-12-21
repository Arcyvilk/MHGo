/// <reference types="vite-plugin-svgr/client" />

import Appearance from './Appearance.svg?react';
import Armory from './Armory.svg?react';
import Coin from './Coin.svg?react';
import Face from './Face.svg?react';
import Friends from './Friends.svg?react';
import Gear from './Gear.svg?react';
import ItemBox from './ItemBox.svg?react';
import Marker from './Marker.svg?react';
import Medal from './Medal.svg?react';
import Monster from './Monster.svg?react';
import News from './News.svg?react';
import Paintball from './Paintball.svg?react';
import Party from './Party.svg?react';
import Paw from './Paw.svg?react';
import Potion from './Potion.svg?react';
import QR from './QR.svg?react';
import Quest from './Quest.svg?react';
import Shop from './Shop.svg?react';
import Spin from './Spin.svg?react';
import Star from './Star.svg?react';
import X from './X.svg?react';

const icons = {
  Appearance,
  Armory,
  Coin,
  Face,
  Friends,
  Gear,
  ItemBox,
  Marker,
  Medal,
  Monster,
  News,
  Paintball,
  Party,
  Paw,
  Potion,
  QR,
  Quest,
  Shop,
  Spin,
  Star,
  X,
};

export type IconType = keyof typeof icons;

export default icons;
