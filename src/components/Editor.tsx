import { FormControl, FormLabel, Input } from "@chakra-ui/react";

const MIN_DURATION_IN_SEC = 5;


export interface Props {
  durationChanged: (e) => void;
  duration: number
}


export const Editor: React.FC<Props> = ({ duration, durationChanged }: Props) => {

  return (
    <FormControl padding={8}>
      <FormLabel>Duration (seconds)</FormLabel>
      <Input type='number' min={MIN_DURATION_IN_SEC} value={duration} onChange={durationChanged} />
    </FormControl>
  )
}

export default Editor;
