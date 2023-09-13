// given a bearing, pitch, altitude, and a targetPosition on the ground to look at,
// calculate the camera's targetPosition as lngLat
let previousCameraPosition: { lng: number; lat: number; }

// linear interpolation
function lerp(start: number, end: number, amt: number) {
  return (1 - amt) * start + amt * end
}

const computeCameraPosition = (
  pitch: number,
  bearing: number,
  targetPosition: { lng: any; lat: any; },
  altitude: number,
  smooth = false
) => {
  const bearingInRadian = bearing / 57.29;
  const pitchInRadian = (90 - pitch) / 57.29;

  const lngDiff = ((altitude / Math.tan(pitchInRadian)) * Math.sin(-bearingInRadian)) / 70000; // ~70km/degree longitude
  const latDiff = ((altitude / Math.tan(pitchInRadian)) * Math.cos(-bearingInRadian)) / 110000 // 110km/degree latitude

  const correctedLng = targetPosition.lng + lngDiff;
  const correctedLat = targetPosition.lat - latDiff;

  const newCameraPosition = {
    lng: correctedLng,
    lat: correctedLat
  };

  if (smooth) {
    if (previousCameraPosition) {
      const SMOOTH_FACTOR = 0.95
      newCameraPosition.lng = lerp(newCameraPosition.lng, previousCameraPosition.lng, SMOOTH_FACTOR);
      newCameraPosition.lat = lerp(newCameraPosition.lat, previousCameraPosition.lat, SMOOTH_FACTOR);
    }
  }

  previousCameraPosition = newCameraPosition

  return newCameraPosition
};

const createGeoJSONCircle = (center: any[], radiusInKm: number, points = 64) => {
  const coords = {
    latitude: center[1],
    longitude: center[0],
  };
  const km = radiusInKm;
  const ret = [];
  const distanceX = km / (111.320 * Math.cos((coords.latitude * Math.PI) / 180));
  const distanceY = km / 110.574;
  let theta: number;
  let x: number;
  let y: number;
  for (let i = 0; i < points; i += 1) {
    theta = (i / points) * (2 * Math.PI);
    x = distanceX * Math.cos(theta);
    y = distanceY * Math.sin(theta);
    ret.push([coords.longitude + x, coords.latitude + y]);
  }
  ret.push(ret[0]);
  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [ret],
    }
  };
}

const downloadFile = (fileName: string, blob: Blob) => {
  const fileUrl = URL.createObjectURL(blob);
  // Attach the object URL to an <a> element, setting the download file name
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(fileUrl);
    document.body.removeChild(a);
  }, 100);
}

export { computeCameraPosition, createGeoJSONCircle, downloadFile };
