import { useState, ChangeEvent } from "react";
import { TrackData } from "../model/TrackData";
import { Map } from "./Map";
import Editor from "./Editor";
import { downloadFile } from "../service/Util";
import { Button, Center, Flex, Grid, GridItem, Heading, Input, Spacer } from "@chakra-ui/react";
import { ReactComponent as GpxSvg } from './../gpx_map.svg';
import { GpxParser } from "../service/GpxParser";


const DURATION_IN_SEC = 20; // 20000;  
const START_BEARING = 0; //  north is 0°, east is 90°, south is 180°, and west is 270°


export interface Props {
  trackData: TrackData
}


export const VideoMap: React.FC = () => {


  const [trackData, setTrackData] = useState<TrackData>();
  let [keySetting, setKeySetting] = useState<number>(0);
  const [duration, setDuration] = useState<number>(DURATION_IN_SEC);
  const [bearing, setBearing] = useState<number>(START_BEARING);
  const [is3DEnabled, setIs3DEnabled] = useState<boolean>(true);

  let [videoBlob, setVideoBlob] = useState<Blob>(null);
  const downloadVideo = (e) => downloadFile(`${trackData.name}.webm`, videoBlob);

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>) => setDuration(parseInt(e.target.value));
  const handleBearingChanged = (e: ChangeEvent<HTMLInputElement>) => setBearing(parseInt(e.target.value));
  const handleis3DEnabledChanged = (e: ChangeEvent<HTMLInputElement>) => setIs3DEnabled(e.target.checked);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0]);
    fileReader.onload = e => {
      const gpxString = e.target.result as string;
      const gpxParser = new GpxParser();
      const trackData: TrackData = gpxParser.parse(gpxString);
      setTrackData(trackData);
    };
  };

  const runVideo = (_) => {
    setVideoBlob(null);
    keySetting++;
    setKeySetting(keySetting);
  }

  return (

    <Grid gridTemplateColumns={'350px 1fr'} >
      <GridItem w='100%' h={"94vh"} className="map-editor" boxShadow='lg'>
        <Flex direction={'column'} height="100%" padding={4}>
          <Editor
            duration={duration} durationChanged={handleDurationChange}
            bearing={bearing} bearingChanged={handleBearingChanged}
            is3DEnabled={is3DEnabled} is3DEnabledChanged={handleis3DEnabledChanged}
          />
          <Button backgroundColor={'#677357'} onClick={runVideo} isDisabled={trackData == null}>Play</Button>
          <Spacer />
          {trackData && <Button backgroundColor={'#677357'} onClick={downloadVideo}
            isLoading={videoBlob == null}
            isDisabled={trackData == null}
            loadingText='Processing video'
          >
            Downlod Video
          </Button>}
        </Flex>

      </GridItem>

      {trackData &&
        <GridItem w='100%' h={"94vh"} >
          <Map key={keySetting} trackData={trackData}
            duration={duration}
            bearing={bearing}
            is3DEnabled={is3DEnabled}
            setVideoBlob={setVideoBlob}
          />
        </GridItem>
      }

      {!trackData &&
        <Center className="map-file-selection" >
          <Flex flexDirection={'column'}>
            <Heading>Upload a GPX file</Heading>
            <GpxSvg height={400} width={400}></GpxSvg>
            <input type='file' id='gpxUploadFile' onChange={handleFileChange} />
          </Flex>
        </Center>
      }
    </Grid>

  )
}

export default VideoMap;
