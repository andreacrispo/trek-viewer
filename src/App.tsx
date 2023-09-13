import { ChangeEvent, useState } from 'react';
import './App.css';

import { GpxParser } from './service/GpxParser';
import { TrackData } from './model/TrackData';
import VideoMap from './components/VideoMap';
import { Center, Flex, Input } from '@chakra-ui/react';
import { ReactComponent as GpxSvg } from './gpx_map.svg';
import Navbar from './components/Navbar';



function App() {

  const [trackData, setTrackData] = useState<TrackData>();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0]);
    fileReader.onload = e => {
      const gpxString = e.target.result as string;
      const gpxParser = new GpxParser();
      const trackData: TrackData = gpxParser.parse(gpxString);
      trackData.getCumulativeDistance();
      setTrackData(trackData);
    };
  };


  return (
    <>
      <Navbar />
      {trackData &&
        <VideoMap trackData={trackData} />
      }

      {!trackData &&
        <Flex w={"100vw"} alignContent={"center"} justifyContent={"center"}>
          <Center>
            <GpxSvg></GpxSvg>
            <Input type='file' id='gpxUploadFile' onChange={handleFileChange} />
          </Center>
        </Flex>
      }
    </>

  );
}

export default App;
