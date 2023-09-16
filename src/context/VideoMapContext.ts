import React from "react";
import { TrackData } from "../model/TrackData";


export interface VideoMapState {

  trackData: TrackData,
  duration: number,
  bearing: number,
  is3DEnabled: boolean,

  setVideoBlob
  setDuration
  setBearing
  setIs3DEnabled
}

const VideoMapContext = React.createContext<VideoMapState>({

  trackData: null,
  bearing: 0,
  duration: 0,
  is3DEnabled: true,
  setDuration: () => { },
  setBearing: () => { },
  setIs3DEnabled: () => { },
  setVideoBlob: () => { }
});

export default VideoMapContext;
