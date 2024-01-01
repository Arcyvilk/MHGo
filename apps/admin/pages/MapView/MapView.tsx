import { Input, Select } from '@mhgo/front';
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
  const [value, setValue] = useState<string>('');

  return (
    <div className={s.mapView}>
      <div className={s.mapView__header}>
        <h1 className={s.mapView__title}>MAP</h1>
      </div>
      <div className={s.mapView__content}>
        <Select data={data} name="stuff" setValue={setValue} />
        <div>{value}</div>
        <Input name="stuff2" value={value} setValue={setValue} />
      </div>
    </div>
  );
};