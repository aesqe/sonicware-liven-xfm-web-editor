import { MIDIMapping } from '../../types'

export const matchMidiMapItem = (cid: number, path: string) => (item: MIDIMapping) => {
  const { controllerIds, propertyPath } = item

  return controllerIds.includes(cid) && propertyPath === path
}
