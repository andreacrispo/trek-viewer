import { useContext, useEffect, useRef, useState } from 'react';

import * as mapboxgl from 'mapbox-gl';

import animatePath from '../service/AnimatePath';
import * as turf from "@turf/turf";
import { Feature, LineString } from 'geojson';
import { add3D, addPathSourceAndLayer, remove3D, setFinalView } from '../service/MapSourceLayer';
import goOnPoint from '../service/GoOnPoint';
import { VideoRecorder } from '../service/VideoRecorder';
import VideoMapContext from '../context/VideoMapContext';

const START_ALTITUDE = 3000000;
const ALTITUDE_VIEW = 12000;


const useMap = () => {

  const {
    trackData,
    duration,
    bearing,
    is3DEnabled,
    setVideoBlob
  } = useContext(VideoMapContext);

  const durationInMs = duration * 1000;

  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [elevation, setElevation] = useState(0);
  const [distance, setDistance] = useState(0);
  const trackGeojson = trackData.toGeoJson().features[0] as Feature<LineString>;

  const firstCoordinate = trackGeojson.geometry.coordinates[0];

  useEffect(() => {
    if (map.current)
      return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      projection: {
        name: "globe"
      },
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      zoom: 1.9466794621990684,
      center: { lng: firstCoordinate[0], lat: firstCoordinate[1] },
      pitch: 70,
      bearing: bearing,
    });


    map.current.on("load", async () => {
      if (is3DEnabled)
        add3D(map.current);

      addPathSourceAndLayer(trackGeojson, map.current);

      const canvas = map.current.getCanvas();

      const videoRecorder = new VideoRecorder(canvas, (videoBlob) => setVideoBlob(videoBlob));

      videoRecorder.start();


      let altitude = ALTITUDE_VIEW;
      let targetLngLat = {
        lng: firstCoordinate[0],
        lat: firstCoordinate[1],
      };


      let result: any = await goOnPoint({
        map: map.current,
        targetLngLat,
        duration: 5000,
        startAltitude: START_ALTITUDE,
        endAltitude: ALTITUDE_VIEW,
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
        setElevation,
        setDistance
      });


      setFinalView(map.current, turf.bbox(trackGeojson), is3DEnabled);

      videoRecorder.stop();
    });


  });


  return {
    mapContainer,
    elevation,
    distance
  }
}

export default useMap;


