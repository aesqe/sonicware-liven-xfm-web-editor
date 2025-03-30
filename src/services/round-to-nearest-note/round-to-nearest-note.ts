import { NOTES } from './constants'

export const roundToNearestNote = (val: number) => {
  const { value, label } = NOTES.reduce((prev, curr) =>
    Math.abs(curr.value - val) < Math.abs(prev.value - val) ? curr : prev
  )

  const index = NOTES.findIndex((note) => note.value === value)

  return {
    value,
    label,
    index
  }
}
