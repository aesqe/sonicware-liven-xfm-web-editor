import { XFMPatch } from '../../types'
// Feedback is tricky because it's split over two bytes with .0 .. .9 fraction stored in one
// place and feedback/10 (0..64) in another - but it is signed so the high part is easy as -1..-63
// is simply 0xFF .. 0xCD but the fractional part is also stored signed so -.1 to -.9 needs
// special handling. The following strips the overall sign, converts to absolute then does the %10 to
// split the fraction then re-applies the sign to the result and converts to 1 byte
const getFeedbackValue = (fb: number) => ((Math.abs(fb) % 10) * fb < 0 ? -1 : 1) & 0xff // -63.0 .. +64.0 (+1.0)

export const getMessage2Payload = ({ OP1, OP2, OP3, OP4, Pitch, Mixer }: XFMPatch) => {
  // payload is 0x88 because TPDT is always 0x98 bytes (from TPDT onwards) and header is 0x10
  const data = new Uint8Array(0x88)

  data[0x00] = getFeedbackValue(OP1.Feedback)
  data[0x5c] = Math.floor(OP1.Feedback / 10) & 0xff
  data[0x5d] = OP1.OP2In
  data[0x5e] = OP1.OP3In
  data[0x5f] = OP1.OP4In
  data[0x6c] = OP1.Output
  data[0x78] = OP1.PitchEnv
  data[0x04] = OP1.Fixed
  data[0x14] = OP1.Ratio & 0xff
  data[0x15] = Math.floor(OP1.Ratio / 256)
  data[0x05] = OP1.Freq & 0x0000ff
  data[0x06] = (OP1.Freq & 0x00ff00) >> 8
  data[0x07] = (OP1.Freq & 0xff0000) >> 16
  data[0x17] = OP1.Detune & 0xff
  data[0x16] = OP1.Level
  data[0x70] = OP1.VelSens
  data[0x74] = OP1.Time
  data[0x7c] = OP1.UpCurve & 0xff
  data[0x7d] = OP1.DnCurve & 0xff
  data[0x4f] = OP1.Scale
  data[0x28] = OP1.ALevel
  data[0x24] = OP1.ATime
  data[0x29] = OP1.DLevel
  data[0x25] = OP1.DTime
  data[0x2a] = OP1.SLevel
  data[0x26] = OP1.STime
  data[0x2b] = OP1.RLevel
  data[0x27] = OP1.RTime
  data[0x4c] = OP1.LGain & 0xff
  data[0x4d] = OP1.RGain & 0xff
  data[0x4e] = OP1.LCurve | OP1.RCurve

  data[0x01] = getFeedbackValue(OP2.Feedback)
  data[0x61] = Math.floor(OP2.Feedback / 10) & 0xff
  data[0x60] = OP2.OP1In
  data[0x62] = OP2.OP3In
  data[0x63] = OP2.OP4In
  data[0x6d] = OP2.Output
  data[0x79] = OP2.PitchEnv
  data[0x08] = OP2.Fixed
  data[0x18] = OP2.Ratio & 0xff
  data[0x19] = Math.floor(OP2.Ratio / 256)
  data[0x09] = OP2.Freq & 0x0000ff
  data[0x0a] = (OP2.Freq & 0x00ff00) >> 8
  data[0x0b] = (OP2.Freq & 0xff0000) >> 16
  data[0x1b] = OP2.Detune & 0xff
  data[0x1a] = OP2.Level
  data[0x71] = OP2.VelSens
  data[0x75] = OP2.Time
  data[0x7e] = OP2.UpCurve & 0xff
  data[0x7f] = OP2.DnCurve & 0xff
  data[0x53] = OP2.Scale
  data[0x30] = OP2.ALevel
  data[0x2c] = OP2.ATime
  data[0x31] = OP2.DLevel
  data[0x2d] = OP2.DTime
  data[0x32] = OP2.SLevel
  data[0x2e] = OP2.STime
  data[0x33] = OP2.RLevel
  data[0x2f] = OP2.RTime
  data[0x50] = OP2.LGain & 0xff
  data[0x51] = OP2.RGain & 0xff
  data[0x52] = OP2.LCurve | OP2.RCurve

  data[0x02] = getFeedbackValue(OP3.Feedback)
  data[0x66] = Math.floor(OP3.Feedback / 10) & 0xff
  data[0x64] = OP3.OP1In
  data[0x65] = OP3.OP2In
  data[0x67] = OP3.OP4In
  data[0x6e] = OP3.Output
  data[0x7a] = OP3.PitchEnv
  data[0x0c] = OP3.Fixed
  data[0x1c] = OP3.Ratio & 0xff
  data[0x1d] = Math.floor(OP3.Ratio / 256)
  data[0x0d] = OP3.Freq & 0x0000ff
  data[0x0e] = (OP3.Freq & 0x00ff00) >> 8
  data[0x0f] = (OP3.Freq & 0xff0000) >> 16
  data[0x1f] = OP3.Detune & 0xff
  data[0x1e] = OP3.Level
  data[0x72] = OP3.VelSens
  data[0x76] = OP3.Time
  data[0x80] = OP3.UpCurve & 0xff
  data[0x81] = OP3.DnCurve & 0xff
  data[0x57] = OP3.Scale
  data[0x38] = OP3.ALevel
  data[0x34] = OP3.ATime
  data[0x39] = OP3.DLevel
  data[0x35] = OP3.DTime
  data[0x3a] = OP3.SLevel
  data[0x36] = OP3.STime
  data[0x3b] = OP3.RLevel
  data[0x37] = OP3.RTime
  data[0x54] = OP3.LGain & 0xff
  data[0x55] = OP3.RGain & 0xff
  data[0x56] = OP3.LCurve | OP3.RCurve

  data[0x03] = getFeedbackValue(OP4.Feedback)
  data[0x6b] = Math.floor(OP4.Feedback / 10) & 0xff
  data[0x68] = OP4.OP1In
  data[0x69] = OP4.OP2In
  data[0x6a] = OP4.OP3In
  data[0x6f] = OP4.Output
  data[0x7b] = OP4.PitchEnv
  data[0x10] = OP4.Fixed
  data[0x20] = OP4.Ratio & 0xff
  data[0x21] = Math.floor(OP4.Ratio / 256)
  data[0x11] = OP4.Freq & 0x0000ff
  data[0x12] = (OP4.Freq & 0x00ff00) >> 8
  data[0x13] = (OP4.Freq & 0xff0000) >> 16
  data[0x23] = OP4.Detune & 0xff
  data[0x22] = OP4.Level
  data[0x73] = OP4.VelSens
  data[0x77] = OP4.Time
  data[0x82] = OP4.UpCurve & 0xff
  data[0x83] = OP4.DnCurve & 0xff
  data[0x5b] = OP4.Scale
  data[0x40] = OP4.ALevel
  data[0x3c] = OP4.ATime
  data[0x41] = OP4.DLevel
  data[0x3d] = OP4.DTime
  data[0x42] = OP4.SLevel
  data[0x3e] = OP4.STime
  data[0x43] = OP4.RLevel
  data[0x3f] = OP4.RTime
  data[0x58] = OP4.LGain & 0xff
  data[0x59] = OP4.RGain & 0xff
  data[0x5a] = OP4.LCurve | OP4.RCurve

  data[0x48] = Pitch.ALevel & 0xff
  data[0x44] = Pitch.ATime
  data[0x49] = Pitch.DLevel & 0xff
  data[0x45] = Pitch.DTime
  data[0x4a] = Pitch.SLevel & 0xff
  data[0x46] = Pitch.STime
  data[0x4b] = Pitch.RLevel & 0xff
  data[0x47] = Pitch.RTime

  data[0x84] = Mixer.Level & 0xff

  // patch is padded to the end with 0xFF in the last 3 bytes
  data[0x85] = 255
  data[0x86] = 255
  data[0x87] = 255

  return data
}
