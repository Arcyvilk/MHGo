import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Button,
  CloseButton,
  Icon,
  Loader,
  QueryBoundary,
  Rain,
  SoundSE,
  addCdnUrl,
  useCompanionApi,
  useLocalStorage,
  useSettingsApi,
  useSounds,
} from '@mhgo/front';
import { chooseRandom } from '@mhgo/utils';

import s from './CompanionView.module.scss';

const companionTips = [
  "I don't have any tips for now but have a nice day!",
  'Did you know that giraffes have no vocal cords?',
  'Did you know that all of those tips are in fact completely useless?',
  'Did you know that you need money to buy stuff from the shop?',
  'Did you know that you can see the list of your items in the inventory?',
  'Did you know that people die when they are killed?',
  'Did you know that you can whip yourself in this game?',
  'Did you know that if you set your home coordinates with the second button on the right, a training dummy will spawn there for you to test various setups?',
  'HAPPY BIRTHDAY!!! <3',
];

export const CompanionView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const [_, setHomePosition] = useLocalStorage<{
    home: number[];
  }>('MHGO_HOME_POSITION', {
    home: [0, 0],
  });

  const { playSound } = useSounds(undefined);
  const [companionTip, setCompanionTip] = useState('Hello!');
  const [isSpeechBubbleOpen, setIsSpeechBubbleOpen] = useState(false);
  const [isRaining, setIsRaining] = useState(false);
  const { setting = '' } = useSettingsApi<string>('default_companion', '');
  const { data: companion } = useCompanionApi(setting);
  const geo = useMemo(() => navigator.geolocation, []);

  useEffect(() => {
    let timeout: any;
    if (isSpeechBubbleOpen)
      timeout = setTimeout(() => {
        setIsSpeechBubbleOpen(false);
      }, 5000);
    () => timeout && clearTimeout(timeout);
  }, [isSpeechBubbleOpen]);

  useEffect(() => {
    let timeout: any;
    if (isRaining)
      timeout = setTimeout(() => {
        setIsRaining(false);
      }, 5000);
    () => timeout && clearTimeout(timeout);
  }, [isRaining]);

  const onPet = () => {
    playSound(SoundSE.WOOF);
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
    toast.success('You get a +50 morale buff for 5 minutes!');
  };

  const onFeed = () => {
    playSound(SoundSE.DOG_EATING);
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
            <img
              src={addCdnUrl(companion.img_full_idle)}
              className={s.companionView__image}
              onClick={onPet}
            />
            {isSpeechBubbleOpen && <SpeechBubble tip={companionTip} />}
            <Rain isRaining={isRaining} setIsRaining={setIsRaining} />
          </div>
        )}
        <div className={s.companionView__actionBar}>
          <Button
            label={<Icon icon="Question" />}
            onClick={onTip}
            variant={Button.Variant.DEFAULT}
            title="Ask your companion for a tip!"
          />
          <Button
            label={<Icon icon="HouseLock" />}
            onClick={onSetHomePosition}
            variant={Button.Variant.DEFAULT}
            title="Set your home position to your current position!"
          />
          <Button
            label={<Icon icon="Music" />}
            onClick={onSing}
            variant={Button.Variant.DEFAULT}
            title="Ask your companion for a motivational battle hymn!"
          />
          <Button
            label={<Icon icon="Drumstick" />}
            onClick={onFeed}
            variant={Button.Variant.DEFAULT}
            title="Feed your companion!"
          />
        </div>
      </div>
      <CloseButton />
    </div>
  );
};

const SpeechBubble = ({ tip }: { tip: string }) => {
  return <div className={s.companionView__speechBubble}>{tip}</div>;
};
