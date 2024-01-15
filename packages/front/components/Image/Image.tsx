import React from 'react';

type ImageProps = { src: string; className: string };
const MemoizedImage = ({ src, className }: ImageProps) => {
  return <img src={src} className={className} />;
};

export const Image = React.memo(MemoizedImage);
