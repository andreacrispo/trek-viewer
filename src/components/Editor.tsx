import { Checkbox, FormControl, FormLabel, Input, Select, VStack } from "@chakra-ui/react";
import VideoMapContext from "../context/VideoMapContext";
import { ChangeEvent, useContext } from "react";

const MIN_DURATION_IN_SEC = 5;



export const Editor: React.FC = () => {

  const {
    duration, setDuration,
    bearing, setBearing,
    is3DEnabled, setIs3DEnabled,
    isFlyOnPointEnabled, setIsFlyOnPointEnabled
  } = useContext(VideoMapContext);

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>) => setDuration(parseInt(e.target.value));
  const handleBearingChanged = (e) => setBearing(parseInt(e.target.value));
  const handleis3DEnabledChanged = (e: ChangeEvent<HTMLInputElement>) => setIs3DEnabled(e.target.checked);
  const handleIsFlyOnPointEnabled = (e: ChangeEvent<HTMLInputElement>) => setIsFlyOnPointEnabled(e.target.checked);


  return (
    <VStack padding={8} spacing={8}>
      <FormControl>
        <FormLabel>Duration (seconds)</FormLabel>
        <Input type='number' min={MIN_DURATION_IN_SEC} value={duration} onChange={handleDurationChange} />
      </FormControl>

      <FormControl>
        <FormLabel>Camera orientation (Bearing)</FormLabel>
        <Select value={bearing} onChange={handleBearingChanged}>
          <option value='0'>North</option>
          <option value='90'>East</option>
          <option value='180'>South</option>
          <option value='270'>West</option>
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>
          <Checkbox size='lg' isChecked={is3DEnabled} onChange={handleis3DEnabledChanged}> Enable 3D</Checkbox>
        </FormLabel>
      </FormControl>

      <FormControl>
        <FormLabel>
          <Checkbox size='lg' isChecked={isFlyOnPointEnabled} onChange={handleIsFlyOnPointEnabled}> Fly on point</Checkbox>
        </FormLabel>
      </FormControl>

    </VStack>
  )
}

export default Editor;
