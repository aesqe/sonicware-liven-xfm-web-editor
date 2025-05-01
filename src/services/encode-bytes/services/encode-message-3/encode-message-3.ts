import { crc32 } from '../../../crc32/crc32'
import { convert87 } from '../../../convert87/convert87'
import { END_BYTE, HEADER } from '../../constants'

export const encodeMessage3 = (msg2: Uint8Array) => {
  // Create message 3 (CRC message)
  let msg3 = new Uint8Array(HEADER.length + 1)
  msg3.set(HEADER)
  msg3[HEADER.length] = 0x03 // sequence number start=1, data=2, crc=3

  // CRC is everything in message2 from byte 9 onwards
  const crc_out = crc32(Array.from(msg2.slice(9)))

  // Convert CRC to bytes
  const crcBytes = new Uint8Array(4)
  crcBytes[0] = crc_out & 0xff
  crcBytes[1] = (crc_out >> 8) & 0xff
  crcBytes[2] = (crc_out >> 16) & 0xff
  crcBytes[3] = (crc_out >> 24) & 0xff

  // Add CRC to msg3
  const msg3Complete = new Uint8Array(msg3.length + crcBytes.length)
  msg3Complete.set(msg3)
  msg3Complete.set(crcBytes, msg3.length)
  msg3 = msg3Complete

  // Convert to 7-bit format
  const msg3_7bit = convert87(msg3)

  const msg3_7bit_complete = new Uint8Array(msg3_7bit.length + 1)
  msg3_7bit_complete.set(msg3_7bit)
  msg3_7bit_complete.set(END_BYTE, msg3_7bit.length)

  return msg3_7bit_complete
}
