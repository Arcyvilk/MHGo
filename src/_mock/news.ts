export type News = {
  date: Date;
  author: string;
  title: string;
  content: string;
  img: string;
};

export const news: News[] = [
  {
    date: new Date(1705392000000),
    author: 'Arcyvilk',
    title: 'Happy birthday!',
    content: '% has birthday today. Hpapy birthday!',
    img: 'https://cdn.arcyvilk.com/mhgo/happybday.jpg',
  },
];
