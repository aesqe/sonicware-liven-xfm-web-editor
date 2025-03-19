import { crc32 } from '../crc32/crc32'
import { XFMPatch } from '../../types'
import { convert87 } from '../convert87/convert87'
import { getMessage2Payload } from '../get-message-2-payload/get-message-2-payload'

const SOUND = 4

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

  // start of is the fixed header (with 01/02/03 message type at end). This (incl 01/02/03) is the
  // one bit that does not get put through 8 to 7 bit conversion
  const hdr = new Uint8Array([0xf0, 0x00, 0x48, 0x04, 0x00, 0x00, 0x03, 0x60])
  const fm_type_container = new Uint8Array([70, 77, 84, 67]) // 'FMTC'
  const fm_name = new Uint8Array([70, 77, 78, 77]) // 'FMNM'
  const the_patch_data = new Uint8Array([84, 80, 68, 84]) // 'TPDT'
  const u32_0_le = new Uint8Array([0x00, 0x00, 0x00, 0x00])
  const u32_1_le = new Uint8Array([0x01, 0x00, 0x00, 0x00])
  const u32_2_le = new Uint8Array([0x02, 0x00, 0x00, 0x00])

  const msg2payload = getMessage2Payload(patch)

  // Create message 1
  let msg1 = new Uint8Array(hdr.length + 1)
  msg1.set(hdr)
  msg1[hdr.length] = 0x01 // sequence number start=1, data=2, crc=3

  // Add SOUND value (4 bytes little endian)
  const soundBytes = new Uint8Array(4)
  soundBytes[0] = SOUND & 0xff
  soundBytes[1] = (SOUND >> 8) & 0xff
  soundBytes[2] = (SOUND >> 16) & 0xff
  soundBytes[3] = (SOUND >> 24) & 0xff

  // Add size (4 bytes little endian)
  const sizeBytes = new Uint8Array(4)
  sizeBytes[0] = size & 0xff
  sizeBytes[1] = (size >> 8) & 0xff
  sizeBytes[2] = (size >> 16) & 0xff
  sizeBytes[3] = (size >> 24) & 0xff

  // Combine everything for msg1
  const msg1Complete = new Uint8Array(msg1.length + soundBytes.length + sizeBytes.length)
  msg1Complete.set(msg1)
  msg1Complete.set(soundBytes, msg1.length)
  msg1Complete.set(sizeBytes, msg1.length + soundBytes.length)
  msg1 = msg1Complete

  // Convert to 7-bit format
  let msg1_7bit = convert87(msg1) // this starts at byte 9 and splits into 7's with leading shift mask

  const endByte = new Uint8Array([0xf7])
  const msg1_7bit_complete = new Uint8Array(msg1_7bit.length + 1)
  msg1_7bit_complete.set(msg1_7bit)
  msg1_7bit_complete.set(endByte, msg1_7bit.length)
  msg1_7bit = msg1_7bit_complete

  // Create message 2
  let msg2 = new Uint8Array(hdr.length + 1)
  msg2.set(hdr)
  msg2[hdr.length] = 0x02 // sequence number start=1, data=2, crc=3

  // Add components to msg2
  const msg2Components = [
    fm_type_container,
    sizeBytes,
    u32_0_le,
    u32_2_le,
    fm_name,
    nameLen,
    u32_0_le
  ]

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
  totalLength += the_patch_data.length + 4 + u32_0_le.length + u32_1_le.length + msg2payload.length

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
  msg2Final.set(the_patch_data, offset)
  offset += the_patch_data.length

  // TPDT size (0x98) as 4 bytes little endian
  const tpdtSize = new Uint8Array([0x98, 0x00, 0x00, 0x00])
  msg2Final.set(tpdtSize, offset)
  offset += tpdtSize.length

  // Remaining components
  msg2Final.set(u32_0_le, offset)
  offset += u32_0_le.length
  msg2Final.set(u32_1_le, offset)
  offset += u32_1_le.length
  msg2Final.set(msg2payload, offset)

  // Update msg2
  msg2 = msg2Final

  // Convert to 7-bit format
  let msg2_7bit = convert87(msg2)

  const msg2_7bit_complete = new Uint8Array(msg2_7bit.length + 1)
  msg2_7bit_complete.set(msg2_7bit)
  msg2_7bit_complete.set(endByte, msg2_7bit.length)
  msg2_7bit = msg2_7bit_complete

  // Create message 3 (CRC message)
  let msg3 = new Uint8Array(hdr.length + 1)
  msg3.set(hdr)
  msg3[hdr.length] = 0x03 // sequence number start=1, data=2, crc=3

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
  let msg3_7bit = convert87(msg3)

  const msg3_7bit_complete = new Uint8Array(msg3_7bit.length + 1)
  msg3_7bit_complete.set(msg3_7bit)
  msg3_7bit_complete.set(endByte, msg3_7bit.length)
  msg3_7bit = msg3_7bit_complete

  return [msg1_7bit, msg2_7bit, msg3_7bit]
}
