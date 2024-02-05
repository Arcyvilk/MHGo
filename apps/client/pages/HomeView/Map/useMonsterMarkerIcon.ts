import { useEffect, useState } from 'react';
import L from 'leaflet';
import { addCdnUrl, modifiers } from '@mhgo/front';

import StarYellow from '@mhgo/front/assets/icons/StarYellow.svg';
import s from './Marker.module.scss';

const DEFAULTS = {
  width: 48,
  starWidth: 18,
  starHeight: 20,
  offsetShadowFactor: 0,
  stars: 5,
  dummyIcon: addCdnUrl('/misc/dummy.png'),
};

export const useMonsterMarkerIcon = (
  thumbnail: string = DEFAULTS.dummyIcon,
  level: number = 0,
) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const [isMarkerIconLoaded, setIsMarkerIconLoaded] = useState(false);
  const [icon, setIcon] = useState(new L.Icon({ iconUrl: DEFAULTS.dummyIcon }));

  useEffect(() => {
    if (!ctx) return;
    drawMonsterMarkerIcon();
  }, []);

  const drawMonsterMarkerIcon = () => {
    // Prepare marker image
    const marker = new Image();
    marker.crossOrigin = 'anonymous';
    marker.src = thumbnail;

    // Prepare star image
    const star = new Image();
    star.crossOrigin = 'anonymous';
    star.src = StarYellow;

    marker.onload = () => {
      const scaleFactor = DEFAULTS.width / marker.width;
      canvas.width = DEFAULTS.width * 1.5;
      canvas.height = DEFAULTS.width * 1.5;

      // Draw the scaled image on the canvas
      ctx!.drawImage(
        marker,
        DEFAULTS.offsetShadowFactor,
        DEFAULTS.offsetShadowFactor,
        marker.width * scaleFactor,
        marker.height * scaleFactor,
      );

      // Draw stars
      new Array(level).fill(null).forEach((_, index) => {
        // TODO center stars no matter their level
        const starPosition = index;
        const top = marker.height * scaleFactor - DEFAULTS.starWidth / 2;
        const left = (starPosition * DEFAULTS.starWidth) / 2;

        ctx!.drawImage(
          star,
          left,
          top,
          DEFAULTS.starHeight,
          DEFAULTS.starWidth,
        );
      });

      const iconUrl = canvas.toDataURL();
      const newIcon = new L.Icon({
        iconUrl,
        className: modifiers(s, 'marker__thumbnail', 'big'),
      });
      setIcon(newIcon);
      setIsMarkerIconLoaded(true);
    };
  };

  return { icon, isMarkerIconLoaded };
};
