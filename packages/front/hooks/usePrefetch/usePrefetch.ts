import { useEffect, useState } from 'react';
import { soundSrcRaw, musicSrcRaw } from '.';
import { usePrefetchAllImagesApi } from '../..';
import { CDN_URL } from '../../env';

let isPrefetch = false;

export const usePrefetch = (isLoggedIn: boolean) => {
  const [_isPrefetch, setIsPrefetch] = useState(isPrefetch);
  const [progress, setProgress] = useState(0);

  const { data: allImages, isFetched } = usePrefetchAllImagesApi(isLoggedIn);

  const allToPrefetch = [
    ...soundSrcRaw.map(i => i[1]),
    ...musicSrcRaw.map(i => i[1]),
    ...allImages,
  ].filter(i => i !== CDN_URL);

  const progressTick = 100 / allToPrefetch.length;

  const prefetch = async (index: number) => {
    if (index < allToPrefetch.length) {
      await fetch(allToPrefetch[index]);
      setProgress(prevProgress => prevProgress + progressTick);

      await prefetch(index + 1);
    } else {
      setProgress(100);
      setIsPrefetch(true);
    }
  };

  useEffect(() => {
    isPrefetch = _isPrefetch;
  }, [_isPrefetch]);

  useEffect(() => {
    if (_isPrefetch) return;
    if (isFetched) prefetch(0);
  }, [isFetched, _isPrefetch]);

  return { isPrefetch: _isPrefetch, progress };
};
