/**
 * The patch is 8 bit but sysex can only carry 7 bit data so the patch is broken into
 * groups of 7 bytes and each 7 byte group is preceded by a 7 bit mask where each bit
 * says whether or not 0x80 (128) should be added to that byte within the 7
 */

/**
 * Convert a 7-byte chunk with a shift byte to 8-bit data
 * @param shifts - The shift byte containing the high bit flags
 * @param data - Array of 7-bit data bytes
 * @returns Array of 8-bit data bytes
 */
export const convert78Chunk = (shifts: number, data: number[]): number[] => {
  if (shifts === 0) {
    return [...data]
  }

  const result: number[] = []

  for (let n = 0; n < data.length; n++) {
    if ((shifts << (n + 1)) & 0x80) {
      result.push(0x80 | data[n])
    } else {
      result.push(data[n])
    }
  }

  return result
}

/**
 * So this takes an entire sysex (from F0 to F7) and breaks it into 8 byte
 * groups of 1 shift byte and 7 data bytes, then passes each in turn to
 * convert78Chunk above and then concatenates all these into result[]
 * @param data - Full sysex message array
 * @returns Array of 8-bit data bytes
 */
export const convert78 = (data: number[]): number[] => {
  const result: number[] = []

  // First discard the front 9 bytes
  let processData = data.slice(9)

  while (processData.length > 0) {
    // If we reached the last byte (F7), ditch it
    if (processData[processData.length - 1] === 0xf7) {
      processData = processData.slice(0, -1)
    }

    // What then follows is a byte holding possible 0x80 shifts for next 7 bytes
    if (processData.length === 0) {
      break
    }

    const shifts = processData[0]

    // And then 7 bytes of data (or fewer if we're at the end)
    const bytesToProcess = Math.min(7, processData.length - 1)
    const bytes = processData.slice(1, 1 + bytesToProcess)

    const next7 = convert78Chunk(shifts, bytes)

    // Now chop off the bytes just processed ready to go again
    const bytesToChop = Math.min(8, processData.length)
    processData = processData.slice(bytesToChop)

    // The processed bytes are added to the result being built up
    result.push(...next7)
  }

  return result
}
