export type XFMPatch = {
  Name: string
  Mixer: { Level: number }
  Pitch: {
    ALevel: number
    ATime: number
    DLevel: number
    DTime: number
    SLevel: number
    STime: number
    RLevel: number
    RTime: number
  }
  OP1: {
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
  OP2: {
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
  OP3: {
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
  OP4: {
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

export type KnobRefType = SetInternalValueRef<number> | null

export type OperatorProps = XFMPatch['OP1'] | XFMPatch['OP2'] | XFMPatch['OP3'] | XFMPatch['OP4']

export type SetInternalValueRef<T> = {
  setInternalValue: (value: T) => void
}

export type OperatorRef = SetInternalValueRef<OperatorProps> & {
  setScaleControlsOpen: (open: boolean) => void
  setADSRControlsOpen: (open: boolean) => void
}

export type RandomizationOptions = {
  amount: number
  freeRatio: boolean
  lowOP1In: boolean
  useStartValues: boolean
}

export type DragPoint = 'attack' | 'decay' | 'sustain' | 'release' | null
