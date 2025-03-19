/**
 * This is the CRC32 that XFM uses. It is the widely used 0xEDB88320 polynomial which is
 * the reversed polynomial of 0x04C11DB7 which is used in MPEG2, Zlib, PKZip, PNG, Zmodem etc.
 *
 * The seed passed in as "crc" to start is 0x00000000 to match what XFM uses.
 */
export const crc32 = (data: number[]): number => {
  // Implementation of CRC32 algorithm to match Python's zlib.crc32
  let crc = 0 ^ -1
  const table = new Array(256)

  for (let i = 0; i < 256; i++) {
    let c = i

    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }

    table[i] = c
  }

  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ data[i]) & 0xff]
  }

  return (crc ^ -1) >>> 0
}
