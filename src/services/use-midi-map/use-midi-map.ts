import { useCallback, useEffect } from 'react'
import { ControlChangeMessageEvent } from 'webmidi'
import { useAtomValue } from 'jotai'
import { useAtomCallback } from 'jotai/utils'
import { useThrottledCallback } from '@mantine/hooks'

import {
  midiMapAtom,
  globalRefsAtom,
  midiMappingModeAtom,
  midiControllerInputAtom,
  lastCCUsedAtom
} from '../../store/atoms'
import { matchMidiMapItem } from '../match-midi-map-item/match-midi-map-item'
import { saveMidiMappings } from '../save-midi-mappings/save-midi-mappings'
import { processMidiMappings } from '../process-midi-mappings/process-midi-mappings'

export const useMidiMap = () => {
  const midiMap = useAtomValue(midiMapAtom)
  const globalRefs = useAtomValue(globalRefsAtom)
  const midiControllerInput = useAtomValue(midiControllerInputAtom)

  const addMapItem = useThrottledCallback(
    useAtomCallback((get, set, event: ControlChangeMessageEvent) => {
      const midiMappingMode = get(midiMappingModeAtom)

      if (!midiMappingMode.active) {
        return
      }

      const controllerId = event.controller.number
      const { propertyPath, controlRange, refName } = midiMappingMode
      const { min, max, center } = controlRange

      if (!propertyPath) {
        return
      }

      set(midiMapAtom, (prev) => {
        const matcher = matchMidiMapItem(controllerId, propertyPath)

        if (prev.find(matcher)) {
          return prev
        }

        const existingMappingIndex = prev.findIndex((item) => item.propertyPath === propertyPath)

        if (existingMappingIndex !== -1) {
          prev[existingMappingIndex].controllerIds.push(controllerId)
        } else {
          prev.push({ controllerIds: [controllerId], propertyPath, min, max, center, refName })
        }

        const newMidiMap = [...prev]

        saveMidiMappings(newMidiMap)

        return newMidiMap
      })
    }),
    500
  )

  const handleControlChange = useThrottledCallback(
    useAtomCallback(
      useCallback(
        (get, set, event: ControlChangeMessageEvent) => {
          if (!midiControllerInput) {
            return
          }

          const midiMappingMode = get(midiMappingModeAtom)

          set(lastCCUsedAtom, event.controller.number)

          if (midiMappingMode.active) {
            return addMapItem(event)
          }

          const mappings = midiMap.filter((item) =>
            item.controllerIds.includes(event.controller.number)
          )

          if (mappings.length === 0) {
            return
          }

          processMidiMappings(mappings, event.value as number, globalRefs)
        },
        [addMapItem, globalRefs, midiControllerInput, midiMap]
      )
    ),
    17 // Throttle to 17ms for ~60 updates per second
  )

  useEffect(() => {
    if (midiControllerInput) {
      midiControllerInput.addListener('controlchange', handleControlChange)
    }

    return () => {
      if (midiControllerInput) {
        midiControllerInput.removeListener('controlchange', handleControlChange)
      }
    }
  }, [handleControlChange, midiControllerInput])
}
