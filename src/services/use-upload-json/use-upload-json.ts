import { useCallback } from 'react'
import { useAtomCallback } from 'jotai/utils'

import { midiMapAtom } from '../../store/atoms'
import { isObjectMidiMap } from '../is-object-midi-map/is-object-midi-map'

export const useUploadJSON = () =>
  useAtomCallback(
    useCallback((_get, set) => {
      const file = document.createElement('input')

      file.onchange = (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0]

        if (file) {
          const reader = new FileReader()

          reader.onload = (e) => {
            const json = JSON.parse((e.target?.result as string | undefined) ?? '')

            if (isObjectMidiMap(json)) {
              set(midiMapAtom, json)
            }
          }

          reader.readAsText(file)
        }
      }

      file.type = 'file'
      file.accept = '.json'

      file.click()
    }, [])
  )
