import { ADSRValues } from '../../../../types'

export const getUpdatedEnvelopeValues = (opId: string, values: ADSRValues) => {
  const updatedValues = [
    { value: values.ATime, propertyPath: `${opId}.ATime` },
    { value: values.ALevel, propertyPath: `${opId}.ALevel` },
    { value: values.DTime, propertyPath: `${opId}.DTime` },
    { value: values.DLevel, propertyPath: `${opId}.DLevel` },
    { value: values.STime, propertyPath: `${opId}.STime` },
    { value: values.SLevel, propertyPath: `${opId}.SLevel` },
    { value: values.RTime, propertyPath: `${opId}.RTime` },
    { value: values.RLevel, propertyPath: `${opId}.RLevel` }
  ]

  if (values.UpCurve !== undefined && values.DnCurve !== undefined) {
    updatedValues.push({ value: values.UpCurve, propertyPath: `${opId}.UpCurve` })
    updatedValues.push({ value: values.DnCurve, propertyPath: `${opId}.DnCurve` })
  }

  return updatedValues
}
