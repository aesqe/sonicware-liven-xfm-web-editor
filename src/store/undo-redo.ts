import { useCallback } from 'react'
import { atom } from 'jotai'
import { useAtomCallback } from 'jotai/utils'

import { XFMPatch } from '../types'
import { objectsAreJSONEqual } from '../services/compare-objects/compare-objects'

const MAX_HISTORY = 100

export const undoStackAtom = atom<XFMPatch[]>([])
export const redoStackAtom = atom<XFMPatch[]>([])

export const useHistory = () => {
  const pushToUndoStack = useAtomCallback(
    useCallback((_get, set, data: XFMPatch) => {
      set(redoStackAtom, [])

      set(undoStackAtom, (current) => {
        const lastItem = current[current.length - 1]

        if (lastItem && objectsAreJSONEqual(lastItem, data)) {
          return current
        }

        return current.concat(data).slice(-MAX_HISTORY)
      })
    }, [])
  )

  const undoAction = useAtomCallback(
    useCallback((get, set, stateBeforeUndo: XFMPatch) => {
      const undoStack = get(undoStackAtom)
      const stateToRestore = undoStack[undoStack.length - 1]

      if (!stateToRestore) {
        return
      }

      const clonedStateToPush = structuredClone(stateBeforeUndo)

      set(undoStackAtom, (current) => current.slice(0, -1))
      set(redoStackAtom, (current) => current.concat(clonedStateToPush).slice(-MAX_HISTORY))

      return stateToRestore
    }, [])
  )

  const redoAction = useAtomCallback(
    useCallback((get, set, stateBeforeRedo: XFMPatch) => {
      const redoStack = get(redoStackAtom)
      const stateToRestore = redoStack[redoStack.length - 1]

      if (!stateToRestore) {
        return
      }

      const clonedStateToPush = structuredClone(stateBeforeRedo)

      set(redoStackAtom, (current) => current.slice(0, -1))
      set(undoStackAtom, (current) => current.concat(clonedStateToPush).slice(-MAX_HISTORY))

      return stateToRestore
    }, [])
  )

  return {
    pushToUndoStack,
    undo: undoAction,
    redo: redoAction
  }
}
