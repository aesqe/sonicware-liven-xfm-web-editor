// all values have to pack into the 128 steps from 0x00 to 0x7F but some are
// really "signed" values like -18..+18, -63..+63, -63..+64 so as soon as the
// dump is received convert such values to signed which basically means (as this
// is in 7 bits not 8 bits) that >64 should be -(128 - n)
export const makeSignedByte = (byte: number): number => {
  let val = byte

  if (byte > 127) {
    val = -1 * (256 - byte)
  }

  return val
}
