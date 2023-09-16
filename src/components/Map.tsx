
// import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import * as mapboxgl from 'mapbox-gl';


import { TrackData } from '../model/TrackData';
import useMap from '../hooks/useVideoMap';

mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kd2hhdHNvIiwiYSI6ImNsbWM0Y281eTAxdGYza256eTA1YnFzbDcifQ.WMwmxneUuPN2aUjRTpl8LQ';


export interface Props {
  trackData: TrackData;
  duration: number;
  bearing: number;
  is3DEnabled: boolean;
  setVideoBlob;
}

export const Map: React.FC<Props> = ({ trackData, duration, setVideoBlob, bearing, is3DEnabled }: Props) => {

  const durationInMs = duration * 1000;

  const {
    mapContainer,
    elevation,
    distance
  } = useMap({ trackData, setVideoBlob, durationInMs, bearing, is3DEnabled: is3DEnabled });


  return (
    <>
      <div className='widget-text-container'> 
        { elevation > 0 &&  <p>Elevation: {elevation} m</p> }
        {distance > 0 &&    <p>Distance: {distance} km</p> }
      </div>
      <div ref={mapContainer} className="map-container" />

    </>
  );
}

export default Map;


