import { MIDIMapping } from '../../types'

export const isObjectMidiMap = (obj: unknown): obj is MIDIMapping[] =>
  Array.isArray(obj) && obj.every((item) => typeof item === 'object' && 'controllerIds' in item)
