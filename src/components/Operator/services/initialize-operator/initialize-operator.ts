import { OperatorProps, UpdatedProperty } from '../../../../types'
import initpatch from '../../../../assets/presets/initpatch.json'

export const initializeOperator = (opId: 'OP1' | 'OP2' | 'OP3' | 'OP4') => {
  const values = initpatch[opId] as OperatorProps

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
    { value: values.OP4In ?? 0, propertyPath: `${opId}.OP4In` },
    { value: values.Output, propertyPath: `${opId}.Output` },
    { value: values.Level, propertyPath: `${opId}.Level` },
    { value: values.VelSens, propertyPath: `${opId}.VelSens` },
    { value: values.Time, propertyPath: `${opId}.Time` },
    { value: values.Scale, propertyPath: `${opId}.Scale` },
    { value: values.LGain, propertyPath: `${opId}.LGain` },
    { value: values.RGain, propertyPath: `${opId}.RGain` },
    { value: values.LCurve, propertyPath: `${opId}.LCurve` },
    { value: values.RCurve, propertyPath: `${opId}.RCurve` }
  ]

  return { values, updatedValues }
}
