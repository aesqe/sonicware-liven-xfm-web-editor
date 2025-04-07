import { useEffect, useRef } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { WebMidi, MessageEvent } from 'webmidi'

import {
  logSysExAtom,
  midiInputAtom,
  midiInputListAtom,
  midiOutputListAtom,
  webMidiEnabledAtom
} from '../../store/atoms'
import { convert78 } from '../convert78/convert78'
import { decode8bit } from '../decode8bit/decode8bit'
import { XFMPatch } from '../../types'

export const useWebMidi = (handlePatchChange: (patch: XFMPatch) => void) => {
  const setMidiInputList = useSetAtom(midiInputListAtom)
  const setMidiOutputList = useSetAtom(midiOutputListAtom)
  const setWebMidiEnabled = useSetAtom(webMidiEnabledAtom)
  const midiInput = useAtomValue(midiInputAtom)
  const logSysEx = useAtomValue(logSysExAtom)
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

  useEffect(() => {
    midiInput?.addListener('sysex', (e: MessageEvent) => {
      if (e.message.data.length > 20) {
        const decodedPatch = decode8bit(convert78(e.message.data))

        if (logSysEx) {
          console.log('Raw SysEx:', new Uint8Array(e.message.data))
          console.log('Decoded SysEx:', new Uint8Array(convert78(e.message.data)))
          console.log('Patch:', decodedPatch)
        }

        handlePatchChange(decodedPatch)
      }
    })

    return () => {
      midiInput?.removeListener('sysex')
    }
  }, [handlePatchChange, logSysEx, midiInput])
}
