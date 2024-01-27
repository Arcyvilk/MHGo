import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Button,
  CloseButton,
  Icon,
  LSKeys,
  Loader,
  QueryBoundary,
  Rain,
  Size,
  SoundSE,
  useCompanionApi,
  useLocalStorage,
  useSettingsApi,
  useSounds,
} from '@mhgo/front';
import { chooseRandom } from '@mhgo/utils';
import { YourCompanion } from '../../containers';

import s from './CompanionView.module.scss';

export const CompanionView = () => (
  <QueryBoundary fallback={<Loader fullScreen />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const { playSound, playRandomSound } = useSounds(undefined);
  const [_, setHomePosition] = useLocalStorage<{
    home: number[];
  }>(LSKeys.MHGO_HOME_POSITION, {
    home: [0, 0],
  });

  const { setting = '' } = useSettingsApi<string>('default_companion', '');
  const { setting: companionTips } = useSettingsApi('companion_tips', [
    'Have a nice day!',
  ]);

  const speechBubbleTimeout = useRef<NodeJS.Timeout>();
  const [companionTip, setCompanionTip] = useState(chooseRandom(companionTips));
  const [isSpeechBubbleOpen, setIsSpeechBubbleOpen] = useState(false);
  const [isRaining, setIsRaining] = useState(false);

  const { data: companion } = useCompanionApi(setting);
  const geo = useMemo(() => navigator.geolocation, []);

  useEffect(() => {
    if (speechBubbleTimeout.current) clearTimeout(speechBubbleTimeout.current);

    if (isSpeechBubbleOpen) {
      speechBubbleTimeout.current = setTimeout(() => {
        setIsSpeechBubbleOpen(false);
      }, 5000);
    }
  }, [companionTip]);

  useEffect(() => {
    let timeout: any;
    if (isRaining)
      timeout = setTimeout(() => {
        setIsRaining(false);
      }, 5000);
    () => timeout && clearTimeout(timeout);
  }, [isRaining]);

  const onPet = () => {
    playRandomSound([
      SoundSE.BARK01,
      SoundSE.BARK02,
      SoundSE.BARK03,
      SoundSE.BARK04,
      SoundSE.BARK05,
      SoundSE.BARK06,
      SoundSE.BARK07,
      SoundSE.BARK08,
      SoundSE.BARK09,
    ]);
    setCompanionTip('I love you <3');
    setIsSpeechBubbleOpen(true);
    setIsRaining(true);
  };

  const onTip = () => {
    const randomTip = chooseRandom(companionTips);
    setCompanionTip(randomTip);
    setIsSpeechBubbleOpen(true);
  };

  const onSing = () => {
    playSound(SoundSE.OPERA_DOG);
    setCompanionTip('Awoooo~');
    setIsSpeechBubbleOpen(true);
    toast.success('You get a +50 morale buff for 5 minutes!');
  };

  const onFeed = () => {
    playSound(SoundSE.DOG_EATING);
    setCompanionTip('*nom nom nom*');
    setIsSpeechBubbleOpen(true);
  };

  const onSetHomePosition = () => {
    toast.info('This will take a moment...');
    geo.getCurrentPosition(
      (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        setHomePosition({ home: [latitude, longitude] });
        toast.success('You have set your home position!');
      },
      error => {
        toast.error('Home position not set, sorry!');
        console.error(`ERROR(${error.code}): ${error.message}`);
      },
    );
  };

  return (
    <div className={s.companionView}>
      <div className={s.header}>
        <div className={s.header__title}>Companion</div>
      </div>

      <div className={s.companionView__wrapper}>
        {companion && (
          <div className={s.companionView__companionWrapper}>
            <div className={s.companionView__name}>
              <Icon icon="DogPaw" size={Size.TINY} />
              {companion?.name}, professional {companion?.species}
              <Icon icon="DogPaw" size={Size.TINY} />
            </div>
            <YourCompanion
              companion={companion}
              isSpeechBubbleOpen={isSpeechBubbleOpen}
              companionTip={companionTip}
              onPet={onPet}
            />
            <Rain type="HEART" isRaining={isRaining} />
            <div className={s.companionView__actionBar}>
              <Button
                label={<Icon icon="Drumstick" />}
                onClick={onFeed}
                variant={Button.Variant.DEFAULT}
                title="Feed your companion!"
              />
              <Button
                label={<Icon icon="Music" />}
                onClick={onSing}
                variant={Button.Variant.DEFAULT}
                title="Ask your companion for a motivational battle hymn!"
              />
              <Button
                label={<Icon icon="HouseLock" />}
                onClick={onSetHomePosition}
                variant={Button.Variant.DEFAULT}
                title="Set your home position to your current position!"
              />
              <Button
                label={<Icon icon="Question" />}
                onClick={onTip}
                variant={Button.Variant.DEFAULT}
                title="Ask your companion for a tip!"
              />
            </div>
          </div>
        )}
      </div>
      <CloseButton />
    </div>
  );
};
