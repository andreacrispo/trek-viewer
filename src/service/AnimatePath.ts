// import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import * as mapboxgl from 'mapbox-gl';

import * as turf from "@turf/turf";
import { computeCameraPosition } from "./Util";
import { Feature, LineString } from "geojson";

const trackPathColor = "yellow";

/**  follow the path while slowly rotating the camera, passing in the camera bearing and altitude from the previous animation */
const animatePath = async ({
  map,
  duration,
  path,
  startBearing,
  startAltitude,
  pitch,
  setElevation
}) => {
  return new Promise<void>(async (resolve) => {

    path = path as Feature<LineString>;

    const pathDistance = turf.lineDistance(path);
    let startTime: number;



    const frame = async (currentTime: number) => {
      if (!startTime)
        startTime = currentTime;

      const animationPhase = (currentTime - startTime) / duration;

      // when the duration is complete, resolve the promise and stop iterating
      if (animationPhase > 1) {
        resolve();
        return;
      }

      // calculate the distance along the path based on the animationPhase
      const alongPath = turf.along(path, pathDistance * animationPhase).geometry.coordinates;

      const lngLat = {
        lng: alongPath[0],
        lat: alongPath[1],
      };


      const elevationFromMap = Math.floor(
        // Do not use terrain exaggeration to get actual meter values
        map.queryTerrainElevation(lngLat, { exaggerated: false })
      );

      setElevation(elevationFromMap);



      // Reduce the visible length of the line by using a line-gradient to cutoff the line
      // animationPhase is a value between 0 and 1 that reprents the progress of the animation
      map.setPaintProperty(
        "line-layer",
        "line-gradient",
        [
          "step",
          ["line-progress"],
          trackPathColor,
          animationPhase,
          "rgba(0, 0, 0, 0)",
        ]
      );

      // slowly rotate the map at a constant rate
      const bearing = startBearing; // - (animationPhase * 200.0);


      // compute corrected camera ground position, so that he leading edge of the path is in view
      const correctedPosition = computeCameraPosition(
        pitch,
        bearing,
        lngLat,
        startAltitude,
        true // smooth
      );

      // set the pitch and bearing of the camera
      const camera = map.getFreeCameraOptions();
      camera.setPitchBearing(pitch, bearing);

      // set the position and altitude of the camera
      camera.position = mapboxgl.MercatorCoordinate.fromLngLat(
        correctedPosition,
        startAltitude
      );

      // apply the new camera options
      map.setFreeCameraOptions(camera);

      // repeat!
      await window.requestAnimationFrame(frame);
    };

    await window.requestAnimationFrame(frame);
  });
};

export default animatePath;
