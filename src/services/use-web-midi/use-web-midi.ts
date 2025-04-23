import { useEffect, useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { WebMidi, MessageEvent } from 'webmidi'
import { useCallbackOne } from 'use-memo-one'

import {
  logSysExAtom,
  midiInputAtom,
  midiInputListAtom,
  midiOutputListAtom,
  webMidiEnabledAtom
} from '../../store/atoms'
import { XFMPatch } from '../../types'
import { convert78 } from '../convert78/convert78'
import { decode8bit } from '../decode8bit/decode8bit'
import { useAtomEffect } from '../use-atom-effect/use-atom-effect'

export const useWebMidi = (handlePatchChange: (patch: XFMPatch) => void) => {
  const setWebMidiEnabled = useSetAtom(webMidiEnabledAtom)
  const midiInput = useAtomValue(midiInputAtom)
  const logSysEx = useAtomValue(logSysExAtom)

  const [midiPortsChanged, setMidiPortsChanged] = useState(1)

  useAtomEffect(
    useCallbackOne(
      (_get, set) => {
        set(midiInputListAtom, WebMidi.inputs)
        set(midiOutputListAtom, WebMidi.outputs)
      },
      [midiPortsChanged]
    )
  )

  useEffect(() => {
    const updateMidiPorts = () => {
      setMidiPortsChanged((prev) => prev + 1)
    }

    WebMidi.enable({ sysex: true })
      .catch((error) => {
        console.log('Failed to enable Web MIDI', error)
      })
      .then(() => {
        WebMidi.addListener('connected', updateMidiPorts)
        WebMidi.addListener('disconnected', updateMidiPorts)

        setWebMidiEnabled(true)
      })

    return () => {
      WebMidi.removeListener('connected', updateMidiPorts)
      WebMidi.removeListener('disconnected', updateMidiPorts)
    }
  }, [setWebMidiEnabled])

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
