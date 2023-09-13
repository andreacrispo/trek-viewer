import mapboxgl from "mapbox-gl";
import { computeCameraPosition } from "./Util";



export function easeCubicOut(t: number) {
  return --t * t * t + 1;
}


export function getAnimationMoltiplicator(animationPhase: number, flyInAndRotate: boolean) {
  if (!flyInAndRotate)
    return 1;

  return easeCubicOut(animationPhase);
}

const goOnPoint = async ({
  map,
  targetLngLat,
  duration,
  startAltitude,
  endAltitude,
  startBearing,
  endBearing,
  startPitch,
  endPitch,
  flyInAndRotate
}) => {
  return new Promise(async (resolve) => {
    let start;

    var currentAltitude;
    var currentBearing;
    var currentPitch;

    // the animation frame will run as many times as necessary until the duration has been reached
    const frame = async (time) => {
      if (!start) {
        start = time;
      }

      // otherwise, use the current time to determine how far along in the duration we are
      let animationPhase = (time - start) / duration;

      // because the phase calculation is imprecise, the final zoom can vary
      // if it ended up greater than 1, set it to 1 so that we get the exact endAltitude that was requested
      if (animationPhase > 1) {
        animationPhase = 1;
      }

      currentAltitude = startAltitude + (endAltitude - startAltitude) * getAnimationMoltiplicator(animationPhase, flyInAndRotate);

      // rotate the camera between startBearing and endBearing
      currentBearing = startBearing + (endBearing - startBearing) * getAnimationMoltiplicator(animationPhase, flyInAndRotate);

      currentPitch = startPitch + (endPitch - startPitch) * getAnimationMoltiplicator(animationPhase, flyInAndRotate);


      // compute corrected camera ground position, so the start of the path is always in view
      let correctedPosition = computeCameraPosition(
        currentPitch,
        currentBearing,
        targetLngLat,
        currentAltitude
      );

      // set the pitch and bearing of the camera
      const camera = map.getFreeCameraOptions();
      camera.setPitchBearing(currentPitch, currentBearing);

      // set the position and altitude of the camera
      camera.position = mapboxgl.MercatorCoordinate.fromLngLat(
        correctedPosition,
        currentAltitude
      );

      // apply the new camera options
      map.setFreeCameraOptions(camera);

      // when the animationPhase is done, resolve the promise so the parent function can move on to the next step in the sequence
      if (animationPhase === 1) {
        resolve({
          bearing: currentBearing,
          altitude: currentAltitude,
        });

        // return so there are no further iterations of this frame
        return;
      }

      await window.requestAnimationFrame(frame);
    };

    await window.requestAnimationFrame(frame);
  });
};



export default goOnPoint;
