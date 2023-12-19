/// <reference types="vite-plugin-svgr/client" />

import Ball from './Ball.svg?react';
import Face from './Face.svg?react';
import Jar from './Jar.svg?react';
import Shop from './Shop.svg?react';
import Utensils from './Utensils.svg?react';

const icons = { Ball, Face, Jar, Shop, Utensils };

export type IconType = keyof typeof icons;

export default icons;
