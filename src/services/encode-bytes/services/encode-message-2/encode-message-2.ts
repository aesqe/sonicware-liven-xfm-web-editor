import { XFMPatch } from '../../../../types'
import { convert87 } from '../../../convert87/convert87'
import { getMessage2Payload } from '../../../get-message-2-payload/get-message-2-payload'
import { FMNM, FMTC, HEADER, END_BYTE, TPDT, U32_0_LE, U32_1_LE, U32_2_LE } from '../../constants'

export const encodeMessage2 = (patch: XFMPatch, size: number, nameLen: Uint8Array<ArrayBuffer>) => {
  const msg2payload = getMessage2Payload(patch)

  let msg2 = new Uint8Array(HEADER.length + 1)
  msg2.set(HEADER)
  msg2[HEADER.length] = 0x02 // sequence number start=1, data=2, crc=3

  // Add size (4 bytes little endian)
  const sizeBytes = new Uint8Array(4)
  sizeBytes[0] = size & 0xff
  sizeBytes[1] = (size >> 8) & 0xff
  sizeBytes[2] = (size >> 16) & 0xff
  sizeBytes[3] = (size >> 24) & 0xff

  // Add components to msg2
  const msg2Components = [FMTC, sizeBytes, U32_0_LE, U32_2_LE, FMNM, nameLen, U32_0_LE]

  // Calculate total length for msg2
  let totalLength = msg2.length
  for (const component of msg2Components) {
    totalLength += component.length
  }

  // Add name length (4 bytes little endian)
  const nameLengthBytes = new Uint8Array(4)
  const nameLength = patch.Name.length
  nameLengthBytes[0] = nameLength & 0xff
  nameLengthBytes[1] = (nameLength >> 8) & 0xff
  nameLengthBytes[2] = (nameLength >> 16) & 0xff
  nameLengthBytes[3] = (nameLength >> 24) & 0xff
  totalLength += nameLengthBytes.length

  // Add name bytes
  const nameBytes = new TextEncoder().encode(patch.Name)
  totalLength += nameBytes.length

  // Calculate padding if name length > 4
  let paddingLength = 0
  if (nameLength > 4) {
    paddingLength = 8 - nameLength
    totalLength += paddingLength
  }

  // Add TPDT and other components
  totalLength += TPDT.length + 4 + U32_0_LE.length + U32_1_LE.length + msg2payload.length

  // Create final msg2 buffer
  const msg2Final = new Uint8Array(totalLength)
  let offset = 0

  // Copy msg2 header
  msg2Final.set(msg2, offset)
  offset += msg2.length

  // Copy other components
  for (const component of msg2Components) {
    msg2Final.set(component, offset)
    offset += component.length
  }

  // Name length
  msg2Final.set(nameLengthBytes, offset)
  offset += nameLengthBytes.length

  // Name bytes
  msg2Final.set(nameBytes, offset)
  offset += nameBytes.length

  // Padding if needed
  if (nameLength > 4) {
    for (let i = 0; i < paddingLength; i++) {
      msg2Final[offset + i] = 0xff
    }
    offset += paddingLength
  }

  // TPDT and remaining components
  msg2Final.set(TPDT, offset)
  offset += TPDT.length

  // TPDT size (0x98) as 4 bytes little endian
  const tpdtSize = new Uint8Array([0x98, 0x00, 0x00, 0x00])
  msg2Final.set(tpdtSize, offset)
  offset += tpdtSize.length

  // Remaining components
  msg2Final.set(U32_0_LE, offset)
  offset += U32_0_LE.length
  msg2Final.set(U32_1_LE, offset)
  offset += U32_1_LE.length
  msg2Final.set(msg2payload, offset)

  // Update msg2
  msg2 = msg2Final

  // Convert to 7-bit format
  let msg2_7bit = convert87(msg2)

  const msg2_7bit_complete = new Uint8Array(msg2_7bit.length + 1)
  msg2_7bit_complete.set(msg2_7bit)
  msg2_7bit_complete.set(END_BYTE, msg2_7bit.length)
  msg2_7bit = msg2_7bit_complete

  return { msg2, msg2_7bit }
}
