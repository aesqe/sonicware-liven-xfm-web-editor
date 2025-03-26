import {
  range0127,
  range503200,
  range1097550,
  range_6363,
  range_6364
} from '../../../ADSREnvelope/constants'
import { ADSRValues, RandomizationOptions, UpdatedProperty, OperatorProps } from '../../../../types'

const randBool = () => Math.random() < 0.5

export const getRandomizedOperatorValues = (
  numId: 1 | 2 | 3 | 4,
  adsr: boolean,
  randomizationOptions: RandomizationOptions,
  startValues: OperatorProps
) => {
  const opId = `OP${numId}`

  console.log(randomizationOptions)

  const { amount, freeRatio, lowOP1In, useStartValues } = randomizationOptions

  const randomAmount = amount / 100

  const randomOP1In = (Math.random() * randomAmount) / 2
  const op1In = lowOP1In ? 0.2 * randomOP1In : randomOP1In

  let ratio = Math.random() * randomAmount
  let freq = (Math.random() * randomAmount) / 3
  let detune = (Math.random() * randomAmount) / 3
  let feedback = Math.random() * randomAmount
  let op2In = (Math.random() * randomAmount) / 2
  let op3In = (Math.random() * randomAmount) / 2
  let op4In = (Math.random() * randomAmount) / 2

  if (useStartValues) {
    const startRatio = range503200.mapTo01(startValues.Ratio)
    const startFreq = range1097550.mapTo01(startValues.Freq)
    const startDetune = range_6363.mapTo01(startValues.Detune)
    const startFeedback = range_6364.mapTo01(startValues.Feedback)
    const startOp2In = range0127.mapTo01(startValues.OP2In ?? 0)
    const startOp3In = range0127.mapTo01(startValues.OP3In ?? 0)
    const startOp4In = range0127.mapTo01(startValues.OP4In ?? 0)

    ratio = randBool() ? startRatio + startRatio * ratio : startRatio - startRatio * ratio
    freq = randBool() ? startFreq + startFreq * freq : startFreq - startFreq * freq
    detune = randBool() ? startDetune + startDetune * detune : startDetune - startDetune * detune
    feedback = randBool()
      ? startFeedback + startFeedback * feedback
      : startFeedback - startFeedback * feedback
    op2In = randBool() ? startOp2In + startOp2In * op2In : startOp2In - startOp2In * op2In
    op3In = randBool() ? startOp3In + startOp3In * op3In : startOp3In - startOp3In * op3In
    op4In = randBool() ? startOp4In + startOp4In * op4In : startOp4In - startOp4In * op4In
  }

  const randomRatio = range503200.mapFrom01(ratio)
  ratio = freeRatio ? range503200.mapFrom01(ratio) : Math.round(randomRatio / 100) * 100

  const adsrValues: ADSRValues = {
    ALevel: range0127.mapFrom01(Math.random() * randomAmount),
    ATime: range0127.mapFrom01(Math.random() * randomAmount),
    DLevel: range0127.mapFrom01(Math.random() * randomAmount),
    DTime: range0127.mapFrom01(Math.random() * randomAmount),
    SLevel: range0127.mapFrom01(Math.random() * randomAmount),
    STime: range0127.mapFrom01(Math.random() * randomAmount),
    RLevel: range0127.mapFrom01(Math.random() * randomAmount),
    RTime: range0127.mapFrom01(Math.random() * randomAmount)
  }

  const values = {
    PitchEnv: Math.round(Math.random() * randomAmount),
    Fixed: Math.round(Math.random() * randomAmount),
    Ratio: ratio,
    Freq: range1097550.mapFrom01(freq),
    Detune: range_6363.mapFrom01(detune),
    Feedback: range_6364.mapFrom01(feedback),
    OP1In: range0127.mapFrom01(op1In),
    OP2In: range0127.mapFrom01(op2In),
    OP3In: range0127.mapFrom01(op3In),
    OP4In: range0127.mapFrom01(op4In)
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

  if (adsr) {
    updatedValues.push(
      { value: adsrValues.ALevel, propertyPath: `${opId}.ALevel` },
      { value: adsrValues.ATime, propertyPath: `${opId}.ATime` },
      { value: adsrValues.DLevel, propertyPath: `${opId}.DLevel` },
      { value: adsrValues.DTime, propertyPath: `${opId}.DTime` },
      { value: adsrValues.SLevel, propertyPath: `${opId}.SLevel` },
      { value: adsrValues.STime, propertyPath: `${opId}.STime` },
      { value: adsrValues.RLevel, propertyPath: `${opId}.RLevel` },
      { value: adsrValues.RTime, propertyPath: `${opId}.RTime` }
    )
  }

  return { values, updatedValues, adsrValues }
}
