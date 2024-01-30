import { useMap } from 'react-leaflet';
import { toast } from 'react-toastify';
import {
  Button,
  Icon,
  LSKeys,
  Size,
  modifiers,
  useLocalStorage,
} from '@mhgo/front';

import { DEFAULT_ZOOM } from '../../../utils/consts';

import s from './Map.module.scss';

type MapActionsProps = { accuracy: number };
export const MapActions = ({ accuracy }: MapActionsProps) => {
  const [zoom] = useLocalStorage(LSKeys.MHGO_MAP_ZOOM, DEFAULT_ZOOM);
  const map = useMap();
  const getAccuracyQuality = () => {
    if (accuracy <= 25) return 'good';
    if (accuracy > 25 && accuracy <= 100) return 'medium';
    if (accuracy > 100 && accuracy <= 500) return 'bad';
    return 'terrible';
  };
  const accuracyQuality = getAccuracyQuality();

  const onRefresh = () => {
    toast.info('Trying to locate you...');
    map.locate({
      setView: true,
      enableHighAccuracy: true,
      maxZoom: zoom.current,
    });
  };

  return (
    <div className={modifiers(s, 'mapActions', accuracyQuality)}>
      <div className={s.mapActions__accuracy}>
        <span>Accuracy</span>
        <span>{accuracyQuality.toUpperCase()}</span>
      </div>
      <Button
        label={<Icon icon="Refresh" size={Size.MICRO} />}
        small
        onClick={onRefresh}
        style={{ width: '24px', flex: '0 0 24px' }}
      />
    </div>
  );
};
