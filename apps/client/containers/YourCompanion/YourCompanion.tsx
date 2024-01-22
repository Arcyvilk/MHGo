import { addCdnUrl, modifiers } from '@mhgo/front';
import { Companion } from '@mhgo/types';

import s from './YourCompanion.module.scss';

type CompanionImageProps = {
  companion: Companion | null;
  isSpeechBubbleOpen: boolean;
  companionTip: string;
  isSmol?: boolean;
  onPet?: () => void;
};
export const YourCompanion = ({
  companion,
  isSpeechBubbleOpen,
  companionTip,
  isSmol = false,
  onPet,
}: CompanionImageProps) => {
  const onClick = () => {
    if (onPet) onPet();
  };

  if (!companion) return null;
  return (
    <div className={s.yourCompanion}>
      <img
        className={modifiers(s, 'yourCompanion__image', { isSmol })}
        src={addCdnUrl(companion.img_full_idle)}
        onContextMenu={e => e.preventDefault()}
        onClick={onClick}
      />
      {isSpeechBubbleOpen && (
        <SpeechBubble tip={companionTip} isSmol={isSmol} />
      )}
    </div>
  );
};

const SpeechBubble = ({ tip, isSmol }: { tip: string; isSmol: boolean }) => {
  return (
    <div className={modifiers(s, 'yourCompanion__speechBubble', { isSmol })}>
      {tip}
    </div>
  );
};
