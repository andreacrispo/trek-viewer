import React from "react";
import { TrackData } from "../model/TrackData";


export interface VideoMapState {

  trackData: TrackData,
  duration: number,
  bearing: number,
  is3DEnabled: boolean,
  isFlyOnPointEnabled: boolean,

  setVideoBlob
  setDuration
  setBearing
  setIs3DEnabled,
  setIsFlyOnPointEnabled
}

const VideoMapContext = React.createContext<VideoMapState>({

  trackData: null,
  bearing: 0,
  duration: 0,
  is3DEnabled: true,
  isFlyOnPointEnabled: true,
  setDuration: () => { },
  setBearing: () => { },
  setIs3DEnabled: () => { },
  setVideoBlob: () => { },
  setIsFlyOnPointEnabled: () => { }
});

export default VideoMapContext;
