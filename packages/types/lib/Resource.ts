export type Resource = {
  id: string;
  name: string;
  description: string;
  img: string;
  thumbnail: string;
  drops: ResourceDrop[];
  levelRequirements: number | null;
};

export type ResourceDrop = {
  materialId: string;
  chance: number;
  amount: number;
};
