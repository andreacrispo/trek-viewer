import { Checkbox, FormControl, FormLabel, Input, Select, VStack } from "@chakra-ui/react";

const MIN_DURATION_IN_SEC = 5;


export interface Props {
  durationChanged: (e) => void;
  duration: number;
  bearing: number;
  bearingChanged: (e) => void;
  is3DEnabled: boolean;
  is3DEnabledChanged: (e) => void;
}


export const Editor: React.FC<Props> = (props: Props) => {

  const {
    duration, durationChanged,
    bearing, bearingChanged,
    is3DEnabled, is3DEnabledChanged,
  } = props;

  return (


    <VStack padding={8} spacing={8}>
      <FormControl>
        <FormLabel>Duration (seconds)</FormLabel>
        <Input type='number' min={MIN_DURATION_IN_SEC} value={duration} onChange={durationChanged} />
      </FormControl>

      <FormControl>
        <FormLabel>Camera orientation (Bearing)</FormLabel>
        <Select value={bearing} onChange={bearingChanged}>
          <option value='0'>North</option>
          <option value='90'>East</option>
          <option value='180'>South</option>
          <option value='270'>West</option>
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>
          <Checkbox size='lg' isChecked={is3DEnabled} onChange={is3DEnabledChanged}> Enable 3D</Checkbox>
        </FormLabel>
      </FormControl>
    </VStack>


  )
}

export default Editor;
