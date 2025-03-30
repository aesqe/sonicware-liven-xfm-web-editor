import { NOTES } from '../round-to-nearest-note/constants'

export const ratioMatchesSomeNote = (ratio: number) => NOTES.some(({ value }) => value === ratio)
