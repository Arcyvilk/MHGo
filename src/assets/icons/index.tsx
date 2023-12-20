/// <reference types="vite-plugin-svgr/client" />

import Appearance from './Appearance.svg?react';
import Ball from './Ball.svg?react';
import Face from './Face.svg?react';
import Friends from './Friends.svg?react';
import Gear from './Gear.svg?react';
import ItemBox from './ItemBox.svg?react';
import Jar from './Jar.svg?react';
import Medal from './Medal.svg?react';
import Monster from './Monster.svg?react';
import News from './News.svg?react';
import Party from './Party.svg?react';
import Paw from './Paw.svg?react';
import QR from './QR.svg?react';
import Shop from './Shop.svg?react';
import Spin from './Spin.svg?react';
import Utensils from './Utensils.svg?react';
import X from './X.svg?react';

const icons = {
  Appearance,
  Ball,
  Face,
  Friends,
  Gear,
  ItemBox,
  Jar,
  Medal,
  Monster,
  News,
  Party,
  Paw,
  QR,
  Shop,
  Spin,
  Utensils,
  X,
};

export type IconType = keyof typeof icons;

export default icons;
