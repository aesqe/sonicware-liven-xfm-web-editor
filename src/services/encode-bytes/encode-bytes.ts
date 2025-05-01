import { SOUND } from './constants'
import { XFMPatch } from '../../types'
import { encodeMessage1 } from './services/encode-message-1/encode-message-1'
import { encodeMessage2 } from './services/encode-message-2/encode-message-2'
import { encodeMessage3 } from './services/encode-message-3/encode-message-3'

export const encodeBytes = (patch: XFMPatch): Uint8Array[] => {
  let size: number
  let nameLen: Uint8Array

  if (patch.Name.length === 4) {
    size = 0xbc
    nameLen = new Uint8Array([0x14, 0x00, 0x00, 0x00])
  } else {
    // it has dots so there are 4 more bytes
    size = 0xc0
    nameLen = new Uint8Array([0x18, 0x00, 0x00, 0x00])
  }

  const msg1_7bit = encodeMessage1(size, SOUND)
  const { msg2, msg2_7bit } = encodeMessage2(patch, size, nameLen)
  const msg3_7bit = encodeMessage3(msg2)

  return [msg1_7bit, msg2_7bit, msg3_7bit, msg2]
}
