import { XFMPatch } from '../../types'
import { makeSignedByte } from '../make-signed-byte/make-signed-byte'
import { createBlankPatch } from '../../services/create-blank-patch/create-blank-patch'
/**
 * This is the second version of decode - it's MUCH easier after the 7 to 8 bit
 * decode because the function does not need to worry about +128 shifts as all that has
 * already been applied. Also, rather than using raw sysex offsets to find data items
 * the offsets in this are based on 0 being the start of the TPDT payload after initial
 * headers have been skipped so the routine can handle patches whether they have four or
 * 8 byte names (that is no dots or with dots).
 */
export const decode8bit = (bytes: number[]): XFMPatch => {
  // Patch (after conversion to 8bit) has this layout
  // 00: FMTC <u32 total_len> <u32 0> <u32 2>
  // 10: FMNM <u32 len = 14 or 18> <u32 0> <u32 name_len> <u8 name characters (4 or 8)>
  // 28/2C: TPDT <u32 len> <u32 0> <u32 1> <u8 payload>
  const patch = createBlankPatch()
  const nameLen = bytes[0x1c]
  let txt = ''

  for (let n = 0; n < nameLen; n++) {
    txt += String.fromCharCode(bytes[0x20 + n])
  }

  patch['Name'] = txt

  let payload: number[]
  if (bytes[0x14] === 0x14) {
    // len of FMNM means it has has just 4 byte payload
    payload = bytes.slice(0x34)
  } else {
    // len is 0x18 so TPDT and rest of patch is 4 bytes further on
    payload = bytes.slice(0x38)
  }

  patch.OP1.Feedback = makeSignedByte(payload[0x5c]) * 10 + makeSignedByte(payload[0])
  patch.OP1.OP2In = payload[0x5d]
  patch.OP1.OP3In = payload[0x5e]
  patch.OP1.OP4In = payload[0x5f]
  patch.OP1.Output = payload[0x6c]
  patch.OP1.PitchEnv = payload[0x78]
  patch.OP1.Fixed = payload[4]

  let ratio = payload[0x15] * 256 + payload[0x14]
  patch.OP1.Ratio = ratio

  let freq = payload[7] * 65536 + payload[6] * 256 + payload[5]
  patch.OP1.Freq = freq

  patch.OP1.Detune = makeSignedByte(payload[0x17])
  patch.OP1.Level = payload[0x16]
  patch.OP1.VelSens = payload[0x70]
  patch.OP1.Time = payload[0x74]
  patch.OP1.UpCurve = makeSignedByte(payload[0x7c])
  patch.OP1.DnCurve = makeSignedByte(payload[0x7d])
  patch.OP1.Scale = payload[0x4f]
  patch.OP1.ALevel = payload[0x28]
  patch.OP1.ATime = payload[0x24]
  patch.OP1.DLevel = payload[0x29]
  patch.OP1.DTime = payload[0x25]
  patch.OP1.SLevel = payload[0x2a]
  patch.OP1.STime = payload[0x26]
  patch.OP1.RLevel = payload[0x2b]
  patch.OP1.RTime = payload[0x27]
  patch.OP1.LGain = makeSignedByte(payload[0x4c])
  patch.OP1.RGain = makeSignedByte(payload[0x4d])
  patch.OP1.LCurve = payload[0x4e] & 0x01
  patch.OP1.RCurve = payload[0x4e] & 0x10 ? 1 : 0

  patch.OP2.Feedback = makeSignedByte(payload[0x61]) * 10 + makeSignedByte(payload[1])
  patch.OP2.OP1In = payload[0x60]
  patch.OP2.OP3In = payload[0x62]
  patch.OP2.OP4In = payload[0x63]
  patch.OP2.Output = payload[0x6d]
  patch.OP2.PitchEnv = payload[0x79]
  patch.OP2.Fixed = payload[8]

  ratio = payload[0x19] * 256 + payload[0x18]
  patch.OP2.Ratio = ratio

  freq = payload[0xb] * 65536 + payload[0xa] * 256 + payload[9]
  patch.OP2.Freq = freq

  patch.OP2.Detune = makeSignedByte(payload[0x1b])
  patch.OP2.Level = payload[0x1a]
  patch.OP2.VelSens = payload[0x71]
  patch.OP2.Time = payload[0x75]
  patch.OP2.UpCurve = makeSignedByte(payload[0x7e])
  patch.OP2.DnCurve = makeSignedByte(payload[0x7f])
  patch.OP2.Scale = payload[0x53]
  patch.OP2.ALevel = payload[0x30]
  patch.OP2.ATime = payload[0x2c]
  patch.OP2.DLevel = payload[0x31]
  patch.OP2.DTime = payload[0x2d]
  patch.OP2.SLevel = payload[0x32]
  patch.OP2.STime = payload[0x2e]
  patch.OP2.RLevel = payload[0x33]
  patch.OP2.RTime = payload[0x2f]
  patch.OP2.LGain = makeSignedByte(payload[0x50])
  patch.OP2.RGain = makeSignedByte(payload[0x51])
  patch.OP2.LCurve = payload[0x52] & 0x01
  patch.OP2.RCurve = payload[0x52] & 0x10 ? 1 : 0

  patch.OP3.Feedback = makeSignedByte(payload[0x66]) * 10 + makeSignedByte(payload[2])
  patch.OP3.OP1In = payload[0x64]
  patch.OP3.OP2In = payload[0x65]
  patch.OP3.OP4In = payload[0x67]
  patch.OP3.Output = payload[0x6e]
  patch.OP3.PitchEnv = payload[0x7a]
  patch.OP3.Fixed = payload[0xc]

  ratio = payload[0x1d] * 256 + payload[0x1c]
  patch.OP3.Ratio = ratio

  freq = payload[0xf] * 65536 + payload[0xe] * 256 + payload[0xd]
  patch.OP3.Freq = freq

  patch.OP3.Detune = makeSignedByte(payload[0x1f])
  patch.OP3.Level = payload[0x1e]
  patch.OP3.VelSens = payload[0x72]
  patch.OP3.Time = payload[0x76]
  patch.OP3.UpCurve = makeSignedByte(payload[0x80])
  patch.OP3.DnCurve = makeSignedByte(payload[0x81])
  patch.OP3.Scale = payload[0x57]
  patch.OP3.ALevel = payload[0x38]
  patch.OP3.ATime = payload[0x34]
  patch.OP3.DLevel = payload[0x39]
  patch.OP3.DTime = payload[0x35]
  patch.OP3.SLevel = payload[0x3a]
  patch.OP3.STime = payload[0x36]
  patch.OP3.RLevel = payload[0x3b]
  patch.OP3.RTime = payload[0x37]
  patch.OP3.LGain = makeSignedByte(payload[0x54])
  patch.OP3.RGain = makeSignedByte(payload[0x55])
  patch.OP3.LCurve = payload[0x56] & 0x01
  patch.OP3.RCurve = payload[0x56] & 0x10 ? 1 : 0

  patch.OP4.Feedback = makeSignedByte(payload[0x6b]) * 10 + makeSignedByte(payload[3])
  patch.OP4.OP1In = payload[0x68]
  patch.OP4.OP2In = payload[0x69]
  patch.OP4.OP3In = payload[0x6a]
  patch.OP4.Output = payload[0x6f]
  patch.OP4.PitchEnv = payload[0x7b]
  patch.OP4.Fixed = payload[0x10]

  ratio = payload[0x21] * 256 + payload[0x20]
  patch.OP4.Ratio = ratio

  freq = payload[0x13] * 65536 + payload[0x12] * 256 + payload[0x11]
  patch.OP4.Freq = freq

  patch.OP4.Detune = makeSignedByte(payload[0x23])
  patch.OP4.Level = payload[0x22]
  patch.OP4.VelSens = payload[0x73]
  patch.OP4.Time = payload[0x77]
  patch.OP4.UpCurve = makeSignedByte(payload[0x82])
  patch.OP4.DnCurve = makeSignedByte(payload[0x83])
  patch.OP4.Scale = payload[0x5b]
  patch.OP4.ALevel = payload[0x40]
  patch.OP4.ATime = payload[0x3c]
  patch.OP4.DLevel = payload[0x41]
  patch.OP4.DTime = payload[0x3d]
  patch.OP4.SLevel = payload[0x42]
  patch.OP4.STime = payload[0x3e]
  patch.OP4.RLevel = payload[0x43]
  patch.OP4.RTime = payload[0x3f]
  patch.OP4.LGain = makeSignedByte(payload[0x58])
  patch.OP4.RGain = makeSignedByte(payload[0x59])
  patch.OP4.LCurve = payload[0x5a] & 0x01
  patch.OP4.RCurve = payload[0x5a] & 0x10 ? 1 : 0

  patch.Pitch.ALevel = makeSignedByte(payload[0x48])
  patch.Pitch.ATime = payload[0x44]
  patch.Pitch.DLevel = makeSignedByte(payload[0x49])
  patch.Pitch.DTime = payload[0x45]
  patch.Pitch.SLevel = makeSignedByte(payload[0x4a])
  patch.Pitch.STime = payload[0x46]
  patch.Pitch.RLevel = makeSignedByte(payload[0x4b])
  patch.Pitch.RTime = payload[0x47]

  patch.Mixer.Level = makeSignedByte(payload[0x84])

  return patch
}
