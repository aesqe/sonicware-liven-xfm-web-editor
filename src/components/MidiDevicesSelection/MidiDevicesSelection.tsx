import { useCallback, useEffect } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { WebMidi } from 'webmidi'
import { useLocalStorage } from '@mantine/hooks'
import { Select, Stack } from '@mantine/core'

import {
  midiInputAtom,
  midiOutputAtom,
  midiOutputListAtom,
  midiInputListAtom,
  webMidiEnabledAtom
} from '../../store/atoms'

export const MidiDevicesSelection = () => {
  const webMidiEnabled = useAtomValue(webMidiEnabledAtom)
  const [midiInput, setMidiInput] = useAtom(midiInputAtom)
  const [midiOutput, setMidiOutput] = useAtom(midiOutputAtom)
  const midiInputList = useAtomValue(midiInputListAtom)
  const midiOutputList = useAtomValue(midiOutputListAtom)

  const [midiInputStorage, setMidiInputStorage] = useLocalStorage({
    key: 'midiInput',
    defaultValue: midiInput?.id
  })

  const [midiOutputStorage, setMidiOutputStorage] = useLocalStorage({
    key: 'midiOutput',
    defaultValue: midiOutput?.id
  })

  const saveMidiInput = (value: string | null) => {
    const input = WebMidi.getInputById(value ?? '') ?? null
    setMidiInputStorage(input?.id ?? '')
    setMidiInput(input)
  }

  const saveMidiOutput = (value: string) => {
    const output = WebMidi.getOutputById(value) ?? null
    setMidiOutputStorage(output?.id ?? '')
    setMidiOutput(output)
  }

  const restoreMidiDevices = useCallback(() => {
    if (midiInputStorage) {
      setMidiInput(WebMidi.getInputById(midiInputStorage) ?? null)
    }

    if (midiOutputStorage) {
      setMidiOutput(WebMidi.getOutputById(midiOutputStorage) ?? null)
    }
  }, [midiInputStorage, midiOutputStorage, setMidiInput, setMidiOutput])

  useEffect(() => {
    if (webMidiEnabled) {
      restoreMidiDevices()
    }
  }, [webMidiEnabled, restoreMidiDevices])

  return (
    <Stack w='100%' gap={10}>
      <Select
        label='MIDI Input'
        data={midiInputList.map((input) => ({
          label: input.name,
          value: input.id
        }))}
        value={midiInput?.id}
        onChange={saveMidiInput}
      />
      <Select
        label='MIDI Output'
        data={midiOutputList.map((output) => ({
          label: output.name,
          value: output.id
        }))}
        value={midiOutput?.id}
        onChange={(value) => saveMidiOutput(value ?? '')}
      />
    </Stack>
  )
}
