import { Select, Stack } from '@mantine/core'

import { useSelectMidiDevices } from '../../services/use-select-midi-devices/use-select-midi-devices'

export const MidiDevicesSelection = () => {
  const { midiInput, midiOutput, midiInputList, midiOutputList, saveMidiInput, saveMidiOutput } =
    useSelectMidiDevices()

  return (
    <Stack w='100%' gap={5}>
      <Select
        label='XFM MIDI Input'
        data={midiInputList.map((input) => ({
          label: input.name,
          value: input.id
        }))}
        value={midiInput?.id}
        onChange={saveMidiInput}
        size='xs'
      />
      <Select
        label='XFM MIDI Output'
        data={midiOutputList.map((output) => ({
          label: output.name,
          value: output.id
        }))}
        value={midiOutput?.id}
        onChange={(value) => saveMidiOutput(value ?? '')}
        size='xs'
      />
    </Stack>
  )
}
