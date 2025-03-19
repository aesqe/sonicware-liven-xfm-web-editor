import {
  range0127,
  range503200,
  range1097550,
  range_6363,
  range_6364
} from '../../../ADSREnvelope/constants'
import { UpdatedProperty } from '../../../../types'

export const randomizeOperator = (opId: 'OP1' | 'OP2' | 'OP3' | 'OP4') => {
  const values = {
    PitchEnv: Math.random() > 0.5 ? 1 : 0,
    Ratio: range503200.mapFrom01(Math.random()),
    Freq: range1097550.mapFrom01(Math.random()),
    Fixed: Math.random() > 0.5 ? 1 : 0,
    Detune: range_6363.mapFrom01(Math.random()),
    Feedback: range_6364.mapFrom01(Math.random()),
    OP1In: range0127.mapFrom01(Math.random()),
    OP2In: range0127.mapFrom01(Math.random()),
    OP3In: range0127.mapFrom01(Math.random()),
    OP4In: range0127.mapFrom01(Math.random())
  }

  const updatedValues: UpdatedProperty[] = [
    { value: values.PitchEnv, propertyPath: `${opId}.PitchEnv` },
    { value: values.Ratio, propertyPath: `${opId}.Ratio` },
    { value: values.Freq, propertyPath: `${opId}.Freq` },
    { value: values.Fixed, propertyPath: `${opId}.Fixed` },
    { value: values.Detune, propertyPath: `${opId}.Detune` },
    { value: values.Feedback, propertyPath: `${opId}.Feedback` },
    { value: values.OP1In ?? 0, propertyPath: `${opId}.OP1In` },
    { value: values.OP2In ?? 0, propertyPath: `${opId}.OP2In` },
    { value: values.OP3In ?? 0, propertyPath: `${opId}.OP3In` },
    { value: values.OP4In ?? 0, propertyPath: `${opId}.OP4In` }
  ]

  return { values, updatedValues }
}
