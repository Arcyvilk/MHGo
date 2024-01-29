import { IsDisabled } from './_Misc';

export type Resource = IsDisabled & {
  id: string;
  name: string;
  description: string;
  img: string;
  thumbnail: string;
  levelRequirements: number | null;
};
