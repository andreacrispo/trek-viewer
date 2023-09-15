import { useEffect, useRef, useState } from 'react';

import * as mapboxgl from 'mapbox-gl';

import animatePath from '../service/AnimatePath';
import * as turf from "@turf/turf";
import { TrackData } from '../model/TrackData';
import { Feature, LineString } from 'geojson';
import { add3D, addPathSourceAndLayer, setFinalView } from '../service/MapSourceLayer';
import goOnPoint from '../service/GoOnPoint';

const START_BEARING = 0; //  north is 0°, east is 90°, south is 180°, and west is 270°
const START_ALTITUDE = 3000000;


const useMap = (trackData: TrackData, setVideoBlob, duration) => {

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
      bearing: 0,
    });


    map.current.on("load", async () => {
      add3D(map.current);
      addPathSourceAndLayer(trackGeojson, map.current);

      // stub performance.now for deterministic rendering per-frame (only available in dev build)
      let now = performance.now();
      mapboxgl.setNow(now);
      function frame() {
        now += 1000 / 60;
        mapboxgl.setNow(now);
      }

      map.current.on('render', frame); // set up frame-by-frame recording
      const stream = map.current.getCanvas().captureStream(60);

      const chunks: any[] = [];
      // Create media recorder from canvas stream
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp9",
      });
      // Record data in chunks array when data is available
      mediaRecorder.ondataavailable = (evt) => {
        chunks.push(evt.data);
      };
      // Provide recorded data when recording stops
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setVideoBlob(blob);
      };

      // Start recording using a 1s / 60 (60fps) timeslice [ie data is made available every 1s)
      mediaRecorder.start(1000 / 60);


      let bearing = START_BEARING;
      let altitude = 12000;

      const firstCoordinate = trackGeojson.geometry.coordinates[0];
      let targetLngLat = {
        lng: firstCoordinate[0],
        lat: firstCoordinate[1],
      };

      setElevation(firstCoordinate[2]);
      //animate zooming in to the start point, get the final bearing and altitude for use in the next animation
      let result: any = await goOnPoint({
        map: map.current,
        targetLngLat,
        duration: 5000,
        startAltitude: START_ALTITUDE,
        endAltitude: 12000,
        startBearing: START_BEARING,
        endBearing: 0,
        startPitch: 40,
        endPitch: 50,
        flyInAndRotate: true
      });
      bearing = result.bearing;
      altitude = result.altitude;


      await new Promise(r => setTimeout(r, 500));
      await animatePath({
        map: map.current,
        duration: duration,
        path: trackGeojson,
        startBearing: bearing,
        startAltitude: altitude,
        pitch: 50,
        setElevation
      });


      setFinalView(map.current, turf.bbox(trackGeojson));

      // stop recording
      map.current.off('render', frame);

      mapboxgl.restoreNow();
      mediaRecorder.stop();
    });


  });


  return {
    mapContainer,
    elevation,
  }
}

export default useMap;

