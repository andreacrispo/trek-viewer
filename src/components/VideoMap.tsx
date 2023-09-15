import { useState, ChangeEvent } from "react";
import { TrackData } from "../model/TrackData";
import { Map } from "./Map";
import Editor from "./Editor";
import { downloadFile } from "../service/Util";
import { Button, Flex, Grid, GridItem, Spacer } from "@chakra-ui/react";


const DURATION_IN_SEC = 20; // 20000;  
const START_BEARING = 0; //  north is 0°, east is 90°, south is 180°, and west is 270°


export interface Props {
  trackData: TrackData
}


export const VideoMap: React.FC<Props> = ({ trackData }: Props) => {
  let [keySetting, setKeySetting] = useState<number>(0);
  const [duration, setDuration] = useState<number>(DURATION_IN_SEC);
  const [bearing, setBearing] = useState<number>(START_BEARING);
  const [is3DEnabled, setIs3DEnabled] = useState<boolean>(true);

  let [videoBlob, setVideoBlob] = useState<Blob>(null);
  const downloadVideo = (e) => downloadFile(`${trackData.name}.webm`, videoBlob);

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>) => setDuration(parseInt(e.target.value));
  const handleBearingChanged = (e: ChangeEvent<HTMLInputElement>) => setBearing(parseInt(e.target.value));
  const handleis3DEnabledChanged = (e: ChangeEvent<HTMLInputElement>) => setIs3DEnabled(e.target.checked);

  const runVideo = (_) => {
    setVideoBlob(null);
    keySetting++;
    setKeySetting(keySetting);
  }

  return (

    <Grid gridTemplateColumns={'350px 1fr'} gap={6}>
      <GridItem w='100%' h={"95vh"} >
        <Flex direction={'column'} height="100%" padding={4}>
          <Editor
            duration={duration} durationChanged={handleDurationChange}
            bearing={bearing} bearingChanged={handleBearingChanged}
            is3DEnabled={is3DEnabled} is3DEnabledChanged={handleis3DEnabledChanged}
          />
          <Button colorScheme='blue' onClick={runVideo}>Play</Button>
          <Spacer />
          <Button colorScheme='blue' onClick={downloadVideo}
            isLoading={videoBlob == null}
            loadingText='Processing video'
          >
            Downlod Video
          </Button>
        </Flex>

      </GridItem>
      <GridItem w='100%' h={"95vh"} >
        <Map key={keySetting} trackData={trackData}
          duration={duration}
          bearing={bearing}
          is3DEnabled={is3DEnabled}
          setVideoBlob={setVideoBlob}
        />
      </GridItem>
    </Grid>

  )
}

export default VideoMap;
