import { createGeoJSONCircle } from "./Util";

const remove3D = (map: any) => {
  map.setLayoutProperty('sky', 'visibility', 'none');
  map.setTerrain();
}

const add3D = (map) => {
  // add map 3d terrain and sky layer and fog
  // Add some fog in the background
  // map.setFog({
  //   range: [0.5, 10],
  //   color: "white",
  //   "horizon-blend": 0.2,
  // });

  // Add a sky layer over the horizon
  map.addLayer({
    id: "sky",
    type: "sky",
    paint: {
      "sky-type": "atmosphere",
      "sky-atmosphere-color": "rgba(85, 151, 210, 0.5)",
    },
  });

  // Add terrain source, with slight exaggeration
  map.addSource("mapbox-dem", {
    type: "raster-dem",
    // url: "mapbox://mapbox.terrain-rgb",
    url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
    tileSize: 512,
    maxzoom: 14,
  });
  map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
};

/**    add a geojson source and layer for the linestring to the map*/
const addPathSourceAndLayer = (trackGeojson, map) => {
  // Add a line feature and layer. This feature will get updated as we progress the animation
  map.addSource("line", {
    type: "geojson",
    // Line metrics is required to use the 'line-progress' property
    lineMetrics: true,
    data: trackGeojson,
  });

  map.addLayer({
    id: "line-layer",
    type: "line",
    source: "line",
    paint: {
      "line-color": "rgba(0,0,0,0)",
      "line-width": 9,
      "line-opacity": 0.8,
    },
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
  });

  map.addSource("start-pin-base", {
    type: "geojson",
    data: createGeoJSONCircle(trackGeojson.geometry.coordinates[0], 0.01)
  });


  map.addLayer({
    id: "start-fill-pin-base",
    type: "fill-extrusion",
    source: "start-pin-base",
    paint: {
      'fill-extrusion-color': '#0bfc03',
      'fill-extrusion-height': 10
    }
  });


  map.addSource('trace', {
    type: 'geojson',
    data: trackGeojson
  });
  map.addLayer({
    type: 'line',
    source: 'trace',
    id: 'line',
    paint: {
      'line-color': '#d6d2d2',
      'line-width': 1
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    }
  });

};


const setFinalView = (map, bounds) => {
  // get the bounds of the linestring, use fitBounds() to animate to a final view
  map.fitBounds(bounds, {
    duration: 3000,
    pitch: 30,
    bearing: 0,
    padding: 120,
  });
  remove3D(map);
}



export { add3D, remove3D, addPathSourceAndLayer, setFinalView };
