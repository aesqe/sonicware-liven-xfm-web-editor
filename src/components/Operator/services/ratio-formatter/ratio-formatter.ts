import { roundToNearestStep } from '../../../../services/round-to-nearest-step/round-to-nearest-step'
import { roundToNearestNote } from '../../../../services/round-to-nearest-note/round-to-nearest-note'

export const ratioFormatter = (val: number, mode: 'default' | 'free' | 'scale') => {
  if (mode === 'scale') {
    const note = roundToNearestNote(val)

    return {
      value: note.value,
      label: note.label
    }
  }

  const value = mode === 'default' ? roundToNearestStep(val, val < 75 ? 50 : 100) : Math.round(val)

  return {
    value,
    label: `${value / 100}`
  }
}
