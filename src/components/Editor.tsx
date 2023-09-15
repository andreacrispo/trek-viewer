import { FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import { bearing } from "@turf/turf";

const MIN_DURATION_IN_SEC = 5;


export interface Props {
  durationChanged: (e) => void;
  duration: number;
  bearing: number;
  bearingChanged: (e) => void;
}


export const Editor: React.FC<Props> = ({ duration, durationChanged, bearing, bearingChanged }: Props) => {

  return (
    <FormControl padding={8}>
      <FormLabel>Duration (seconds)</FormLabel>
      <Input type='number' min={MIN_DURATION_IN_SEC} value={duration} onChange={durationChanged} />

      <FormLabel>Camera orientation (Bearing)</FormLabel>
      <Select value={bearing} onChange={bearingChanged}>
        <option value='0'>North</option>
        <option value='90'>East</option>
        <option value='180'>South</option>
        <option value='270'>West</option>
      </Select>
    </FormControl>
  )
}

export default Editor;
