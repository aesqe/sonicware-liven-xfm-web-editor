import { XFMPatch } from '../types'
import { decode8bit } from '../services/decode8bit/decode8bit'
import { findSequenceIndexes } from '../find-sequence-indexes/find-sequence-indexes'

export const getBankPatches = (data: number[]) => {
  const patchIndexes = findSequenceIndexes(data, 'FMTC')

  const patches: XFMPatch[] = []

  for (let i = 0; i < patchIndexes.length; i++) {
    const start = patchIndexes[i]
    const end = patchIndexes[i + 1]
    const block = data.slice(start, end)
    const patch = decode8bit(block)

    patches.push(patch)
  }

  return patches
}
