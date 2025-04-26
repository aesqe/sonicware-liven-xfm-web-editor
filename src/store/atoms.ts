import { atom } from 'jotai'
import { Input, Output } from 'webmidi'

import {
  XFMPatch,
  ADSRValues,
  OperatorValues,
  RandomizationOptions,
  GlobalRefs,
  MIDIMapping
} from '../types'
import initPatch from '../assets/presets/initpatch.json'
import { atomWithListeners } from '../services/atom-with-listeners/atom-with-listeners'

export const webMidiEnabledAtom = atom<boolean>(false)

export const midiInputAtom = atom<Input | null>(null)
export const midiOutputAtom = atom<Output | null>(null)
export const midiInputListAtom = atom<Input[]>([])
export const midiOutputListAtom = atom<Output[]>([])

export const [patchAtom, usePatchAtomListener] = atomWithListeners<XFMPatch>(initPatch)

export const randomizationOptionsAtom = atom<RandomizationOptions>({
  amount: 50,
  freeRatio: true,
  lowOP1In: false,
  useStartValues: false
})

export const messagesDelayAtom = atom<number>(16.7)
export const sysexSendThrottleTimeAtom = atom<number>(100)

export const patchClipboardAtom = atom<XFMPatch | null>(null)
export const envelopeClipboardAtom = atom<ADSRValues | null>(null)
export const operatorClipboardAtom = atom<OperatorValues | null>(null)

export const logSysExAtom = atom<boolean>(false)

export const globalRefsAtom = atom<GlobalRefs>({
  op1Ref: undefined,
  op2Ref: undefined,
  op3Ref: undefined,
  op4Ref: undefined,
  pitchAdsrRef: undefined,
  patchNameRef: undefined
})

export const midiControllerInputAtom = atom<Input | null>(null)
export const lastCCUsedAtom = atom<number>(-1)
export const midiMapAtom = atom<MIDIMapping[]>([])
export const midiMappingModeAtom = atom({
  active: false,
  propertyPath: '',
  refName: '',
  controlRange: {
    min: 0,
    max: 127,
    center: 64
  }
})
