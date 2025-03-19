import { ADSRValues } from '../../../../types'
import { NormalisableRange } from '../../../../services/normalisable-range/normalisable-range'
import { range_1818, range0127 } from '../../constants'

export const convertInput = (values: ADSRValues, range: NormalisableRange): ADSRValues => {
  const returnValues = {
    ATime: range0127.mapTo01(values.ATime),
    ALevel: range.mapTo01(values.ALevel),
    DTime: range0127.mapTo01(values.DTime),
    DLevel: range.mapTo01(values.DLevel),
    STime: range0127.mapTo01(values.STime),
    SLevel: range.mapTo01(values.SLevel),
    RTime: range0127.mapTo01(values.RTime),
    RLevel: range.mapTo01(values.RLevel)
  }

  if (values.UpCurve !== undefined && values.DnCurve !== undefined) {
    return {
      ...returnValues,
      UpCurve: range_1818.mapTo01(values.UpCurve),
      DnCurve: range_1818.mapTo01(values.DnCurve)
    }
  }

  return returnValues
}
