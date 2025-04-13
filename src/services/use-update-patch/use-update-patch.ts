import { useCallback } from 'react'
import { useAtomCallback } from 'jotai/utils'
import { useThrottledCallback } from '@mantine/hooks'

import { patchAtom } from '../../store/atoms'
import { useHistory } from '../../store/undo-redo'
import { UpdatedProperty } from '../../types'
import { objectsAreJSONEqual } from '../compare-objects/compare-objects'
import { updateObjectValueByPath } from '../update-object-value-by-path/update-object-value-by-path'

export const useUpdatePatch = () => {
  const { pushToUndoStack } = useHistory()

  const throttledPushToUndoStack = useThrottledCallback(pushToUndoStack, 1000)

  return useAtomCallback(
    useCallback(
      (get, set, props: UpdatedProperty[]) => {
        const patch = get(patchAtom)

        const updatedPatch = props.reduce(
          (acc, { propertyPath, formatterFn, value }) =>
            updateObjectValueByPath(acc, propertyPath, formatterFn?.(value) ?? value),
          patch
        )

        if (objectsAreJSONEqual(updatedPatch, patch)) {
          return
        }

        throttledPushToUndoStack(patch)

        const lines = [
          '\x1B[93;41;4m useUpdatePatch ',
          ...props.map((p) => `\x1B[47;97;4m${p.propertyPath}:\x1B[m ${p.value}`)
        ]

        console.log(lines.join('\n'))

        set(patchAtom, updatedPatch)
      },
      [throttledPushToUndoStack]
    )
  )
}
