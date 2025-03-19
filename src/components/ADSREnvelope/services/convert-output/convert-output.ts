import { ADSRValues } from '../../../../types'
import { NormalisableRange } from '../../../../services/normalisable-range/normalisable-range'
import { range_1818, range0127 } from '../../constants'

export const convertOutput = (values: ADSRValues, range: NormalisableRange): ADSRValues => {
  const returnValues = {
    ATime: range0127.mapFrom01(values.ATime),
    ALevel: range.mapFrom01(values.ALevel),
    DTime: range0127.mapFrom01(values.DTime),
    DLevel: range.mapFrom01(values.DLevel),
    STime: range0127.mapFrom01(values.STime),
    SLevel: range.mapFrom01(values.SLevel),
    RTime: range0127.mapFrom01(values.RTime),
    RLevel: range.mapFrom01(values.RLevel)
  }

  if (values.UpCurve !== undefined && values.DnCurve !== undefined) {
    return {
      ...returnValues,
      UpCurve: range_1818.mapFrom01(values.UpCurve),
      DnCurve: range_1818.mapFrom01(values.DnCurve)
    }
  }

  return returnValues
}
