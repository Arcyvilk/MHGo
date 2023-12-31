import { Select } from '@mhgo/front';
import s from './MapView.module.scss';
import { useState } from 'react';

type Data = { id: string; name: string };
const data: Data[] = [
  { id: '1', name: 'vfde' },
  { id: '2', name: 'hvfuej' },
  { id: '3', name: 'fbdvbr' },
  { id: '4', name: 'dnehiufr' },
  { id: '5', name: 'fbdue' },
];
export const MapView = () => {
  const [value, setValue] = useState<string>();

  return (
    <div className={s.mapView}>
      <Select data={data} name="stuff" setValue={setValue} />
      <div>{value}</div>
    </div>
  );
};
