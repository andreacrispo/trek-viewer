

import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import { TrackData } from '../model/TrackData';
import useMap from '../hooks/useVideoMap';

mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kd2hhdHNvIiwiYSI6ImNsbWM0Y281eTAxdGYza256eTA1YnFzbDcifQ.WMwmxneUuPN2aUjRTpl8LQ';


export interface Props {
  trackData: TrackData
  duration: number
  setVideoBlob
}

export const Map: React.FC<Props> = ({ trackData, duration, setVideoBlob }: Props) => {

  const durationInMs = duration * 1000;

  const {
    mapContainer,
    elevation,
  } = useMap(trackData, setVideoBlob, durationInMs);


  return (
    <>
      {<div className='elevation-text-container'> Elevation: {elevation} </div>}
      <div ref={mapContainer} className="map-container" />

    </>
  );
}

export default Map;


