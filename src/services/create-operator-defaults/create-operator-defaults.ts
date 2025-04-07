import { OperatorValues } from '../../types'

export const createOperatorDefaults = (): OperatorValues => ({
  Feedback: 0, // -63.0..+64.0 (+1.0)
  OP1In: 0, // 0..127 (+1)
  OP2In: 0, // 0..127 (+1)
  OP3In: 0, // 0..127 (+1)
  OP4In: 0, // 0..127 (+1)
  Output: 0, // 0..127 (+1)
  PitchEnv: 0, // OFF / ON
  Fixed: 0, // OFF / ON
  Ratio: 0, // 0.50..32.00 (+.01)
  Freq: 0, // 0..97550 (+1)
  Detune: 0, // -63..63 (+1)
  Level: 0, // 0..127 (+1)
  VelSens: 0, // 0..127 (+1)
  Time: 0, // 0..127 (+1)
  UpCurve: 0, // -18..+18 (+1)
  DnCurve: 0, // -18..+18 (+1)
  Scale: 0, // C1..C7 (0..6)
  LGain: 0, // -63..+63 (+1)
  RGain: 0, // -63..+63 (+1)
  LCurve: 0, // 0..127 (+1)
  ALevel: 0, // 0..127 (+1) - for pitch envelope it's -48..48
  ATime: 0, // 0..127 (+1)
  DLevel: 0, // 0..127 (+1) - for pitch envelope it's -48..48
  DTime: 0, // 0..127 (+1)
  SLevel: 0, // 0..127 (+1) - for pitch envelope it's -48..48
  STime: 0, // 0..127 (+1)
  RLevel: 0, // 0..127 (+1) - for pitch envelope it's -48..48
  RTime: 0, // 0..127 (+1)
  RCurve: 0 // 0..127 (+1),
})
