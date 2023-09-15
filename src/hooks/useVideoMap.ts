import { useEffect, useRef, useState } from 'react';

import * as mapboxgl from 'mapbox-gl';

import animatePath from '../service/AnimatePath';
import * as turf from "@turf/turf";
import { TrackData } from '../model/TrackData';
import { Feature, LineString } from 'geojson';
import { add3D, addPathSourceAndLayer, setFinalView } from '../service/MapSourceLayer';
import goOnPoint from '../service/GoOnPoint';
import { VideoRecorder } from '../service/VideoRecorder';
import { blob } from 'stream/consumers';

const START_ALTITUDE = 3000000;

export interface Props {
  trackData: TrackData;
  durationInMs: number;
  bearing: number;
  setVideoBlob;
}

const useMap = ({ trackData, setVideoBlob, durationInMs, bearing }: Props) => {

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [elevation, setElevation] = useState(0);
  const trackGeojson = trackData.toGeoJson().features[0] as Feature<LineString>;

  useEffect(() => {
    if (map.current)
      return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      projection: "globe",
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      zoom: 1.9466794621990684,
      center: { lng: 45.65331270304168, lat: 8.549541959889874 },
      pitch: 70,
      bearing: bearing,
    });


    map.current.on("load", async () => {

      add3D(map.current);

      addPathSourceAndLayer(trackGeojson, map.current);

      const canvas = map.current.getCanvas();

      const videoRecorder = new VideoRecorder(canvas, (videoBlob) => setVideoBlob(videoBlob));

      videoRecorder.start();


      let altitude = 12000;
      const firstCoordinate = trackGeojson.geometry.coordinates[0];
      let targetLngLat = {
        lng: firstCoordinate[0],
        lat: firstCoordinate[1],
      };

      setElevation(firstCoordinate[2]);

      let result: any = await goOnPoint({
        map: map.current,
        targetLngLat,
        duration: 5000,
        startAltitude: START_ALTITUDE,
        endAltitude: 12000,
        startBearing: bearing,
        endBearing: bearing,
        startPitch: 40,
        endPitch: 50,
        flyInAndRotate: true
      });
      altitude = result.altitude;


      await new Promise(r => setTimeout(r, 500));
      await animatePath({
        map: map.current,
        duration: durationInMs,
        path: trackGeojson,
        startBearing: bearing,
        startAltitude: altitude,
        pitch: 50,
        setElevation
      });


      setFinalView(map.current, turf.bbox(trackGeojson));

      videoRecorder.stop();
    });


  });


  return {
    mapContainer,
    elevation,
  }
}

export default useMap;


