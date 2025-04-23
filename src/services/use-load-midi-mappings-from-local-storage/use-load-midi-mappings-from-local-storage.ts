import { useAtomCallback } from 'jotai/utils'

import { midiMapAtom } from '../../store/atoms'

export const useLoadMidiMappingsFromLocalStorage = () =>
  useAtomCallback((_get, set) => {
    try {
      const savedMappings = localStorage.getItem('xfm-midi-mappings')

      if (savedMappings) {
        set(midiMapAtom, JSON.parse(savedMappings))
        return true
      }
    } catch (error) {
      console.error('Failed to load MIDI mappings', error)
    }

    return false
  })
