
// import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import * as mapboxgl from 'mapbox-gl';
import useMap from '../hooks/useVideoMap';

(mapboxgl as any).accessToken = 'pk.eyJ1IjoiYW5kd2hhdHNvIiwiYSI6ImNsbWM0Y281eTAxdGYza256eTA1YnFzbDcifQ.WMwmxneUuPN2aUjRTpl8LQ';



export const Map: React.FC = () => {

  const {
    mapContainer,
    elevation,
    distance
  } = useMap();


  return (
    <>
      <div className='widget-text-container'>
        {elevation > 0 && <p>Elevation: {elevation} m</p>}
        {distance > 0 && <p>Distance: {distance} km</p>}
      </div>
      <div ref={mapContainer} className="map-container" />

    </>
  );
}

export default Map;


