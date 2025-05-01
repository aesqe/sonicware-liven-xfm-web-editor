// start of is the fixed header (with 01/02/03 message type at end). This (incl 01/02/03) is the
// one bit that does not get put through 8 to 7 bit conversion
export const HEADER = new Uint8Array([0xf0, 0x00, 0x48, 0x04, 0x00, 0x00, 0x03, 0x60])
export const FMTC = new Uint8Array([70, 77, 84, 67])
export const FMNM = new Uint8Array([70, 77, 78, 77])
export const TPDT = new Uint8Array([84, 80, 68, 84])
export const U32_0_LE = new Uint8Array([0x00, 0x00, 0x00, 0x00])
export const U32_1_LE = new Uint8Array([0x01, 0x00, 0x00, 0x00])
export const U32_2_LE = new Uint8Array([0x02, 0x00, 0x00, 0x00])
export const END_BYTE = new Uint8Array([0xf7])
export const SOUND_BANK = 1
export const SOUND = 4
