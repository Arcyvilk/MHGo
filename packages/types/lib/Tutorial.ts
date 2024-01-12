export type TutorialStep = {
  id: string;
  companionImg: string | null;
  companionSpeech: string | null;
  spotlight: [string, string, string, string?] | null;
  spotlightShape: 'circle' | 'rectangle' | null;
  closeNext: boolean;
  img: string | null;
  text: string | null;
  effects: 'rays' | null;
};
