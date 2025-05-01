import { convert87 } from '../../../convert87/convert87'
import { HEADER, END_BYTE } from '../../constants'

export const encodeMessage1 = (size: number, dataType: number) => {
  let msg1 = new Uint8Array(HEADER.length + 1)
  msg1.set(HEADER)
  msg1[HEADER.length] = 0x01 // sequence number start=1, data=2, crc=3

  // Add data type value (4 bytes little endian)
  const dataTypeBytes = new Uint8Array(4)
  dataTypeBytes[0] = dataType & 0xff
  dataTypeBytes[1] = (dataType >> 8) & 0xff
  dataTypeBytes[2] = (dataType >> 16) & 0xff
  dataTypeBytes[3] = (dataType >> 24) & 0xff

  // Add size (4 bytes little endian)
  const sizeBytes = new Uint8Array(4)
  sizeBytes[0] = size & 0xff
  sizeBytes[1] = (size >> 8) & 0xff
  sizeBytes[2] = (size >> 16) & 0xff
  sizeBytes[3] = (size >> 24) & 0xff

  // Combine everything for msg1
  const msg1Complete = new Uint8Array(msg1.length + dataTypeBytes.length + sizeBytes.length)
  msg1Complete.set(msg1)
  msg1Complete.set(dataTypeBytes, msg1.length)
  msg1Complete.set(sizeBytes, msg1.length + dataTypeBytes.length)
  msg1 = msg1Complete

  // Convert to 7-bit format
  let msg1_7bit = convert87(msg1) // this starts at byte 9 and splits into 7's with leading shift mask

  const msg1_7bit_complete = new Uint8Array(msg1_7bit.length + 1)
  msg1_7bit_complete.set(msg1_7bit)
  msg1_7bit_complete.set(END_BYTE, msg1_7bit.length)
  msg1_7bit = msg1_7bit_complete

  return msg1_7bit
}
