import { useAtomCallback } from 'jotai/utils'

import { MIDIMapping } from '../../types'
import { midiMapAtom } from '../../store/atoms'
import { saveMidiMappings } from '../save-midi-mappings/save-midi-mappings'
import { matchMidiMapItem } from '../match-midi-map-item/match-midi-map-item'

export const useRemoveMidiMapItem = () =>
  useAtomCallback((_get, set, controllerId: number, propertyPath: string) => {
    const matcher = matchMidiMapItem(controllerId, propertyPath)

    set(midiMapAtom, (prev) => {
      const itemIndex = prev.findIndex(matcher)

      if (itemIndex !== -1) {
        prev[itemIndex].controllerIds = prev[itemIndex].controllerIds.filter(
          (id) => id !== controllerId
        )

        let newMidiMap: MIDIMapping[] = []

        if (prev[itemIndex].controllerIds.length === 0) {
          newMidiMap = prev.filter((item) => item.propertyPath !== propertyPath)
        } else {
          newMidiMap = [...prev]
        }

        saveMidiMappings(newMidiMap)

        return newMidiMap
      }

      return prev
    })
  })
