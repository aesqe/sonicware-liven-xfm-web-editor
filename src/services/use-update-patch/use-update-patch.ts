import { useCallback } from 'react'
import { useAtomCallback } from 'jotai/utils'

import { patchAtom } from '../../store/atoms'
import { UpdatedProperty } from '../../types'
import { objectsAreJSONEqual } from '../compare-objects/compare-objects'
import { updateObjectValueByPath } from '../update-object-value-by-path/update-object-value-by-path'

export const useUpdatePatch = () =>
  useAtomCallback(
    useCallback((get, set, props: UpdatedProperty[]) => {
      const patch = get(patchAtom)

      const updatedPatch = props.reduce(
        (acc, { propertyPath, formatterFn, value }) =>
          updateObjectValueByPath(acc, propertyPath, formatterFn?.(value) ?? value),
        patch
      )

      if (objectsAreJSONEqual(updatedPatch, patch)) {
        return
      }

      set(patchAtom, updatedPatch)
    }, [])
  )
