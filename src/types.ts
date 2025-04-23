import { RefObject } from 'react'

export type OP1Props = {
  Feedback: number
  OP1In?: number
  OP2In: number
  OP3In: number
  OP4In: number
  Output: number
  PitchEnv: number
  Fixed: number
  Ratio: number
  Freq: number
  Detune: number
  Level: number
  VelSens: number
  Time: number
  UpCurve: number
  DnCurve: number
  Scale: number
  ALevel: number
  ATime: number
  DLevel: number
  DTime: number
  SLevel: number
  STime: number
  RLevel: number
  RTime: number
  LGain: number
  RGain: number
  LCurve: number
  RCurve: number
}

export type OP2Props = {
  Feedback: number
  OP1In: number
  OP2In?: number
  OP3In: number
  OP4In: number
  Output: number
  PitchEnv: number
  Fixed: number
  Ratio: number
  Freq: number
  Detune: number
  Level: number
  VelSens: number
  Time: number
  UpCurve: number
  DnCurve: number
  Scale: number
  ALevel: number
  ATime: number
  DLevel: number
  DTime: number
  SLevel: number
  STime: number
  RLevel: number
  RTime: number
  LGain: number
  RGain: number
  LCurve: number
  RCurve: number
}

export type OP3Props = {
  Feedback: number
  OP1In: number
  OP2In: number
  OP3In?: number
  OP4In: number
  Output: number
  PitchEnv: number
  Fixed: number
  Ratio: number
  Freq: number
  Detune: number
  Level: number
  VelSens: number
  Time: number
  UpCurve: number
  DnCurve: number
  Scale: number
  ALevel: number
  ATime: number
  DLevel: number
  DTime: number
  SLevel: number
  STime: number
  RLevel: number
  RTime: number
  LGain: number
  RGain: number
  LCurve: number
  RCurve: number
}

export type OP4Props = {
  Feedback: number
  OP1In: number
  OP2In: number
  OP3In: number
  OP4In?: number
  Output: number
  PitchEnv: number
  Fixed: number
  Ratio: number
  Freq: number
  Detune: number
  Level: number
  VelSens: number
  Time: number
  UpCurve: number
  DnCurve: number
  Scale: number
  ALevel: number
  ATime: number
  DLevel: number
  DTime: number
  SLevel: number
  STime: number
  RLevel: number
  RTime: number
  LGain: number
  RGain: number
  LCurve: number
  RCurve: number
}

export type XFMPatch = {
  Name: string
  Mixer: { Level: number }
  Pitch: ADSRValues
  OP1: OP1Props
  OP2: OP2Props
  OP3: OP3Props
  OP4: OP4Props
}

export type ADSRValues = {
  ALevel: number
  ATime: number
  DLevel: number
  DTime: number
  SLevel: number
  STime: number
  RLevel: number
  RTime: number
  UpCurve?: number
  DnCurve?: number
}

export type UpdatedProperty = {
  value: number
  propertyPath: string
  formatterFn?: (val: number) => number
}

export type KnobRefType = {
  setInternalValue: (value: number, fromMidi?: boolean) => void
} | null

export type OperatorValues = OP1Props | OP2Props | OP3Props | OP4Props

export type SetInternalValueRef<T> = {
  setInternalValue: (value: T, skipChange?: boolean) => void
}

export type OperatorRef = SetInternalValueRef<OperatorValues> & {
  setScaleControlsOpen: (open: boolean) => void
  setADSRControlsOpen: (open: boolean) => void
  refs: {
    levelRef: RefObject<KnobRefType>
    outputRef: RefObject<KnobRefType>
    velSensRef: RefObject<KnobRefType>
    ratioRef: RefObject<KnobRefType>
    freqRef: RefObject<KnobRefType>
    detuneRef: RefObject<KnobRefType>
    feedbackRef: RefObject<KnobRefType>
    op1InRef: RefObject<KnobRefType>
    op2InRef: RefObject<KnobRefType>
    op3InRef: RefObject<KnobRefType>
    op4InRef: RefObject<KnobRefType>
    pitchEnvRef: RefObject<HTMLInputElement | null>
    fixedSwitchRef: RefObject<HTMLInputElement | null>
  }
}

export type ADSREnvelopeRef = SetInternalValueRef<ADSRValues> & {
  refs: {
    aTimeRef: RefObject<KnobRefType>
    aLevelRef: RefObject<KnobRefType>
    dTimeRef: RefObject<KnobRefType>
    dLevelRef: RefObject<KnobRefType>
    sTimeRef: RefObject<KnobRefType>
    sLevelRef: RefObject<KnobRefType>
    rTimeRef: RefObject<KnobRefType>
    rLevelRef: RefObject<KnobRefType>
    upCurveRef: RefObject<KnobRefType>
    dnCurveRef: RefObject<KnobRefType>
  }
}

export type ScaleControlsValues = {
  Time: number
  Scale: number
  LGain: number
  LCurve: number
  RGain: number
  RCurve: number
}

export type ScaleControlsRef = SetInternalValueRef<ScaleControlsValues> & {
  refs: {
    timeRef: RefObject<KnobRefType>
    scaleRef: RefObject<KnobRefType>
    lGainRef: RefObject<KnobRefType>
    lCurveRef: RefObject<KnobRefType>
    rGainRef: RefObject<KnobRefType>
    rCurveRef: RefObject<KnobRefType>
  }
}

export type RatioRef = SetInternalValueRef<number> & {
  resetPrevRatioMode: () => void
}

export type RandomizationOptions = {
  amount: number
  freeRatio: boolean
  lowOP1In: boolean
  useStartValues: boolean
}

export type DragPoint = 'attack' | 'decay' | 'sustain' | 'release' | null

export type Banks = Record<string, XFMPatch[]>

export type RatioMode = 'default' | 'free' | 'scale'

export type GlobalRefs = {
  op1Ref: RefObject<OperatorRef | undefined> | undefined
  op2Ref: RefObject<OperatorRef | undefined> | undefined
  op3Ref: RefObject<OperatorRef | undefined> | undefined
  op4Ref: RefObject<OperatorRef | undefined> | undefined
  pitchAdsrRef: RefObject<SetInternalValueRef<ADSRValues> | undefined> | undefined
  patchNameRef: RefObject<SetInternalValueRef<string> | undefined> | undefined
}
