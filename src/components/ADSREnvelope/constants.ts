import { ADSRValues } from '../../types'
import { NormalisableRange } from '../../services/normalisable-range/normalisable-range'

export const range_1818 = new NormalisableRange(-18, 18, 0)
export const range_4848 = new NormalisableRange(-48, 48, 0)
export const range_6364 = new NormalisableRange(-63, 64, 0)
export const range_6363 = new NormalisableRange(-63, 63, 0)
export const range0127 = new NormalisableRange(0, 127, 63)
export const range503200 = new NormalisableRange(50, 3200, 1600)
export const range1097550 = new NormalisableRange(10, 97550, 48775)

export const defaultADSRCurve: ADSRValues = {
  ALevel: 0,
  ATime: 0,
  DLevel: 63,
  DTime: 0,
  SLevel: 127,
  STime: 0,
  RLevel: 0,
  RTime: 63,
  UpCurve: 0,
  DnCurve: 0
}

export const defaultADSRCurve01: ADSRValues = {
  ALevel: 0,
  ATime: 0,
  DLevel: 0.5,
  DTime: 0,
  SLevel: 1,
  STime: 0,
  RLevel: 0,
  RTime: 0.5,
  UpCurve: 0.5,
  DnCurve: 0.5
}

export const defaultPitchADSRCurve: ADSRValues = {
  ALevel: 0,
  ATime: 0,
  DLevel: 0,
  DTime: 0,
  SLevel: 0,
  STime: 0,
  RLevel: 0,
  RTime: 0
}

export const defaultPitchADSRCurve01: ADSRValues = {
  ALevel: 0.5,
  ATime: 0.5,
  DLevel: 0.5,
  DTime: 0.5,
  SLevel: 0.5,
  STime: 0.5,
  RLevel: 0.5,
  RTime: 0.5
}

export const spreadADSRCurve01: ADSRValues = {
  ALevel: 112 / 127,
  ATime: 45 / 127,
  DLevel: 101 / 127,
  DTime: 127 / 127,
  SLevel: 90 / 127,
  STime: 119 / 127,
  RLevel: 0,
  RTime: 91 / 127,
  UpCurve: 0.5,
  DnCurve: 0.5
}
