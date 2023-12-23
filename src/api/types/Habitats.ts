export type HabitatType = 'swamp' | 'desert' | 'forest' | 'cave';
export type Habitat = {
  id: string;
  type: HabitatType;
  name: string;
  description: string;
  image: string;
};
