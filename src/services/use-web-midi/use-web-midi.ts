import { useEffect, useRef } from 'react'
import { useSetAtom } from 'jotai'
import { WebMidi } from 'webmidi'

import { midiInputListAtom, midiOutputListAtom, webMidiEnabledAtom } from '../../store/atoms'

export const useWebMidi = () => {
  const setMidiInputList = useSetAtom(midiInputListAtom)
  const setMidiOutputList = useSetAtom(midiOutputListAtom)
  const setWebMidiEnabled = useSetAtom(webMidiEnabledAtom)
  const listenersAdded = useRef(false)

  useEffect(() => {
    if (listenersAdded.current) {
      return
    }

    const updateMidiPorts = () => {
      setMidiInputList(WebMidi.inputs)
      setMidiOutputList(WebMidi.outputs)
    }

    WebMidi.enable({ sysex: true })
      .catch((error) => {
        console.log('Failed to enable Web MIDI', error)
      })
      .then(() => {
        updateMidiPorts()

        WebMidi.addListener('connected', updateMidiPorts)
        WebMidi.addListener('disconnected', updateMidiPorts)

        setWebMidiEnabled(true)

        listenersAdded.current = true
      })

    return () => {
      WebMidi.removeListener('connected', updateMidiPorts)
      WebMidi.removeListener('disconnected', updateMidiPorts)
    }
  }, [setMidiInputList, setMidiOutputList, setWebMidiEnabled])
}
