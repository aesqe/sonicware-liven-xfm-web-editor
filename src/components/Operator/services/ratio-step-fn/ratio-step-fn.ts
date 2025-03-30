import { clamp } from '@dsp-ts/math'

import { NOTES } from '../../../../services/round-to-nearest-note/constants'
import { roundToNearestNote } from '../../../../services/round-to-nearest-note/round-to-nearest-note'

export const ratioStepFn = (
  val: number,
  ratioMode: 'default' | 'free' | 'scale',
  largerStep: boolean,
  direction: 'up' | 'down' | undefined
) => {
  if (ratioMode === 'default') {
    return largerStep ? 1000 : val < 75 ? 50 : 100
  }

  if (ratioMode === 'scale') {
    const { index } = roundToNearestNote(val)
    const nextIndex = direction === 'up' ? index + 1 : index - 1
    const nextNote = NOTES[clamp(nextIndex, 0, NOTES.length - 1)]

    return Math.abs(nextNote.value - val)
  }

  return largerStep ? 10 : 1
}
