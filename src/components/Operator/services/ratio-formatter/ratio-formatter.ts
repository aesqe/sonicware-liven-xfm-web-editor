import { RefObject } from 'react'

import { NOTES } from '../../../../services/round-to-nearest-note/constants'
import { roundToNearestStep } from '../../../../services/round-to-nearest-step/round-to-nearest-step'
import { roundToNearestNote } from '../../../../services/round-to-nearest-note/round-to-nearest-note'
import { RatioMode, SetInternalValueRef } from '../../../../types'

export const ratioFormatter = (
  val: number,
  mode: RatioMode,
  prevRatioModeRef: RefObject<RatioMode>,
  ratioRef: RefObject<SetInternalValueRef<number> | null>
) => {
  let value = val
  let label = ''

  const prevMode = prevRatioModeRef.current

  if (mode === 'scale') {
    const note =
      prevMode === 'scale' && val >= 0 && val <= 60
        ? NOTES[Math.round(val)]
        : roundToNearestNote(Math.round(val / 100) * 100)

    value = 'index' in note ? (note.index as number) : note.value

    label = note.label
  } else {
    if (prevMode === 'scale') {
      value = NOTES[Math.round(val)].value
    }

    if (mode === 'default') {
      value = roundToNearestStep(value, value < 75 ? 50 : 100)
    } else {
      value = Math.round(value)
    }

    label = `${value / 100}`
  }

  if (ratioRef.current && mode !== prevMode) {
    prevRatioModeRef.current = mode
    ratioRef.current.setInternalValue(value)
  }

  return {
    value,
    label
  }
}
