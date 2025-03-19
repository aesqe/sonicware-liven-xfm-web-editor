/**
 * Convert byte array from 8-bit to 7-bit format for MIDI SysEx
 *
 * When sending messages, the body after the 9 byte header has to be grouped
 * into 7 bytes at a time with a leading byte that shows any +128 shifts for the 7
 * to follow (and that shift byte has to be in 7bits too - hence groups of 7 not 8)
 */
export const convert87 = (data: Uint8Array): Uint8Array => {
  // First 9 bytes are the header - keep as is
  const header = data.slice(0, 9)
  const payload = data.slice(9)
  const result: number[] = [...header]

  // Process payload in groups of 7 bytes
  for (let i = 0; i < payload.length; i += 7) {
    const chunk = payload.slice(i, i + 7)
    let mask = 0

    // Calculate the mask byte
    for (let j = 0; j < chunk.length; j++) {
      mask |= (chunk[j] & 0x80) >> (j + 1)
      chunk[j] &= 0x7f // Clear the high bit
    }

    // Add the mask byte followed by the 7 data bytes (with high bits cleared)
    result.push(mask)
    result.push(...chunk)
  }

  return Uint8Array.from(result)
}
